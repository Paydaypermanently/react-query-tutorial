import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

const addHero = (newHero) => {
  axios.post("http://localhost:4000/hero", newHero);
};

const deleteHero = (id) => {
  axios.delete(`http://localhost:4000/hero/${id}`);
};

//   useQuery를 사용하면, 최상위에서 호출해야된다는 훅의 규칙에 위배되기 때문에
//   create, update, delete 등과 같이 이벤트 핸들러를 사용하여 server state에 사이드 이펙트를 일으키는 경우에는 mutation을 사용하는것이 좋다!!!!!( 이 때 쿼리무효화 invalidation 필수 ).

export const useAddHero = (refetch) => {
  return useMutation(addHero, {
    onMutate: (variables) => {
      // 뮤테이션 시작
      // onMutate가 리턴하는 객체는 이하 생명주기에서 context 파라미터로 참조가 가능하다.

      return { id: 1 };
    },
    onError: (error, variables, context) => {
      // 에러가 났음
      console.log(`rolling back optimistic update with id ${context.id}`);
    },
    onSuccess: (data, variables, context) => {
      // 성공
      //setText('') 이와 같이 입력 칸 공백으로 만들기 가능
      // setTimeout(() => {
      //   console.log("쿼리무효화 및 리패칭 시도");
      //   queryClient.invalidateQueries("hero");
      // }, 400);
      // setTimeout 적용 안할 시 성공과 "동시에" 리패칭을 진행하기 때문에 view애 추가한 내용이 나타나지 않고  POST를 한번 더 할경우 이전것이 view에 나타남
      //1초의 시간차를 줘서 리패칭하도록 하면 view에 변경사항이 잘 반영됨
      refetch();
      console.log(
        "variables:" +
          JSON.stringify(variables) +
          "context:" +
          JSON.stringify(context) +
          "POST 성공"
      );
    },
    onSettled: (data, error, variables, context) => {
      // 성공이든 에러든 어쨌든 끝났을 때
      console.log("끝");
    },
  });
};

export const useDeleteHero = (refetch) => {
  return useMutation(deleteHero, {
    onError: (error, variables, context) => {
      // 에러가 났음
      console.log(`rolling back optimistic update with id ${context.id}`);
    },
    onSuccess: (data, variables, context) => {
      refetch();
    },
  });
};

export const useFetchHero = () => {
  return useQuery(
    ["hero"], //쿼리 키 unique key : 한 번 fresh가 되었다면 계속 추적이 가능하다. 리패칭, 캐싱, 공유 등을 할때 참조되는 값. 주로 배열을 사용하고, 배열의 요소로 쿼리의 이름을 나타내는 문자열과 프로미스를 리턴하는 함수의 인자로 쓰이는 값을 넣는다.
    () => axios.get("http://localhost:4000/hero"), //promise
    { retry: 2, staleTime: 500, select: (data) => data.data } // 1초 fresh 뒤 stale상태 }  //옵션주기
  );
};
