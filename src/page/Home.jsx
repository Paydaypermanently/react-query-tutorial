import React, { useState, Fragment } from "react";
import Item from "../components/Item";
import { useAddHero, useDeleteHero, useFetchHero } from "../hook/hook";
import styled from "styled-components";

const HeroStyle = styled.div`
  width: 100%;
  height: 12vh;
  font-size: 1.5vw;
  background-color: ${(props) => props.color};
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2vw;
  margin: 1vw;
`;

const InputFormStyle = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1vw;
  align-items: center;
`;

//서버의 데이터를 바꿀 수 있는 경우라면 mutation 사용
// 잘못 된 API주소로 요청을 했을 때 3번 더 요청을 했으며, 다른 브라우저를 클릭하여 포커스를 옮긴 후 실행중인 리액트 앱을 다시 클릭해서 포커스가 됐을 때 리패칭이 일어났다.
// 쿼리 키를 배열로 준 후 파라미터를 주어 id값 등 구분자로 이용할 수도 있다.
// 쿼리는 4가지의 상태를 가진다.

// 1. fresh: 새롭게 추가된 쿼리 인스턴스이며, active 상태의 시작이다. staleTimedl 0이기 때문에 아무런 설정을 해주지 않으면 호출이 끝나고 바로 stale상태로 변한다.

// 2.fetching: 요청을 수행하는 중인 쿼리이다.

// 3: stale: 인스턴스가 존재하지만 이미 패칭이 완료된 쿼리이다. 특정 쿼리가 stale된 상태에서 같은 쿼리 마운트를 시도한다면 캐싱된 데이터를 반환하면서 리패칭을 시도한다.

// 4. inactive: active 인스턴스가 하나도 없는 쿼리이다. inactive된 이후에도 cacheTime동안 캐시된 데이터가 유지되며 cacheTime이 지나면 GC된다.

function Home() {
  const [colorChecked, setColorChecked] = useState(false);
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const { isLoading, error, data, isFetching, refetch } = useFetchHero();

  const { mutate: createHero } = useAddHero(refetch);
  const { mutate: removeHero } = useDeleteHero(refetch);

  const handleChangeName = ({ target: { value } }) => setName(value);
  const handleChangeSkill = ({ target: { value } }) => setSkill(value);
  const handleSubmit = () => createHero({ name: name, skill: skill });
  const handleDelete = (id) => {
    removeHero(id);
  }; //삭제기능 추가
  const handleChangeColor = () => {
    colorChecked === true ? setColorChecked(false) : setColorChecked(true);
  };
  //if (isLoading) return "Loading...";
  //if (error) return "An error has occurred: " + error.message;
  return (
    <>
      <h2 id="title">Heroes</h2>

      <InputFormStyle>
        <Fragment>
          <input
            className="inputStyle"
            type="text"
            name="name"
            value={name}
            placeholder="영웅이름"
            onChange={handleChangeName}
          />

          <input
            className="inputStyle"
            type="text"
            name="skill"
            value={skill}
            placeholder="스킬"
            onChange={handleChangeSkill}
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="submit_button"
          >
            새로운 영웅 추가
          </button>
          <button
            type="button"
            onClick={handleChangeColor}
            className="submit_button"
          >
            다크모드전환 & 해제
          </button>
        </Fragment>
      </InputFormStyle>
      <h1>
        {isFetching ? (
          <div>loading!!</div>
        ) : (
          data.map((hero) => (
            <HeroStyle color={colorChecked ? "black" : "gray"}>
              <Item key={hero.id} hero={hero} handleDelete={handleDelete} />
            </HeroStyle>
          )) //key값으로 index를 쓰면 성능이 떨어질 수 있으니 다른걸 사용하는게 좋음.
        )}
      </h1>
    </>
  );
}
export default Home;
//  react-query를 사용하여 데이터를 받아와 출력한 결과

// Home.jsx:16 Uncaught TypeError: Cannot read properties of undefined (reading 'data') 이와 같은 에러가 발생하였다.

// 데이터를 받아오는 과정은 비동기적으로 수행되고, 콘솔에 data를 출력하는 라인이 바로 실행되는데, data에 값이 없기 때문이다.

//optional

// useEffect를 사용하여 컴포넌트가 마운트된 후 2초 뒤에 실행시키도록 하여도 똑같은 에러가 발생한다.

// Get요청을 보내는 쿼리도 컴포넌트가 마운트되며 생성되고 이와 동시에 useEffect안의 함수도 실행되는데, 아마 실행과 동시에 setTimeout 함수와는 관계없이 data의 state를 check 하는 모양인듯 싶다..
// 위와 같이 data를 출력하는 코드를 콜백 함수로 작성하여 2초후에 실행되도록 했을 때 데이터가 잘 출력되는 것을 확인할 수 있었다.

// 하지만 setTimeout 코드가 실행되는 순간 data값은 정의되어 있지 않으므로, 에러는 여전히 발생한다.
// 데이터를 뿌려줄 때도 상태에 맞는 조건에 대한 값을 모두 지정해줘야 데이터가 잘 뿌려지는 것을 확인할 수 있었다.

//useMutation은 API콜 후 reponse를 받아올 수 없다, 성공/실패 여부는 알 수 있음
