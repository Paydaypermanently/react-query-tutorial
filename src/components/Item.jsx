import React from "react";

function Item({ hero, handleDelete, energy, dispatch, increment }) {
  return (
    <>
      <div>{hero.id}</div>
      <div>{hero.name}</div>
      <div>{hero.skill}</div>
      <div>영웅에너지:{energy}</div>
      <button
        onClick={() => {
          handleDelete(hero.id);
        }}
      >
        delete
      </button>
      <button
        onClick={() => {
          dispatch(increment());
        }}
      >
        영웅에너지증가
      </button>
    </>
  );
}

export default Item;
