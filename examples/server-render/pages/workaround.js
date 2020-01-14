import React from 'react';
import Link from 'next/link'
import fetcher from '../libs/fetcher'
import Nav from '../components/nav'
import Pokemon from '../components/pokemon'

import useSWR from 'swr'

const useFixedSWR = (key, fetcher, {initialData, ...config} = {}) => {
  const initial = React.useRef(initialData);
  React.useEffect(() => {
    if(key){
      initial.current = undefined;
    }
  }, [key]);
  return useSWR(key, fetcher, {...config, initialData: initial.current});
}

const api = {
  list: () => 'https://pokeapi.co/api/v2/pokemon/',
  item: (pokemon) => `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
}

export default function Home(props) {
  const { data: list } = useFixedSWR(api.list(), fetcher, { initialData: props.list })
  const [selected, setSelected] = React.useState(list.results[0].name);
  const { data: item } = useFixedSWR(api.item(selected), fetcher, { initialData: props.item })

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Nav />
      <h2>Workaround</h2>
      <div>
        <label htmlFor="pokemon-select">Choose a pokemon:</label>
        <select name="pets" id="pet-select" defaultValue={selected} onChange={e => { setSelected(e.target.value); }}>
          {list.results.map(pokemon => (
            <option value={pokemon.name} key={pokemon.name}>
              {pokemon.name}
            </option>
          ))}
        </select>
        <Pokemon item={item} />
        <hr/>
        <h3>Workaround itself:</h3>
        <pre><code>{`

const useFixedSWR = (key, fetcher, {initialData, ...config} = {}) => {
  const initial = React.useRef(initialData);
  React.useEffect(() => {
    if(key){
      initial.current = undefined;
    }
  }, [key]);
  return useSWR(key, fetcher, {...config, initialData: initial.current});
}

        `}</code></pre>
      </div>
    </div>
  )
}

Home.getInitialProps = async () => {
  const list = await fetcher(api.list())
  const item = await fetcher(api.item(list.results[0].name))
  return { list, item }
}
