import React from "react";

function Item({ hero, handleDelete }) {
  return (
    <>
      <div>{hero.id}</div>
      <div>{hero.name}</div>
      <div>{hero.skill}</div>
      <button
        onClick={() => {
          handleDelete(hero.id);
        }}
      >
        delete
      </button>
    </>
  );
}

export default Item;
