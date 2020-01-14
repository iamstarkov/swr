export default function Pokemon({ item, revalidate }) {
  if (!item || !item.name) return (<div>loading...</div>);
  return (
    <div>
      <h2>{item.name}</h2>
      <div>
        <figure>
          <img src={item.sprites.front_default} width="96" height="96" />
        </figure>
        <p>height: {item.height}</p>
        <p>weight: {item.weight}</p>
        <p>abilities: {item.abilities.map(({ ability }) => ability.name).join(', ')}</p>
        {revalidate
          ? <p><button onClick={revalidate}>revalidate</button></p>
          : <></>
        }
      </div>
    </div>
  )
}
