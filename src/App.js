import React, {useEffect, useState} from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import './App.css'
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {
    //useState é usado para salvar o estado do objeto, depois de passar pela função.
    //neste caso, movielist terá o valor da list, que por sua vez é o resultado da função getHomelist().
    const [movieList, setMovielist] = useState([]);
    //Aqui vamos fazer outra requisição de lista, desta vez para selecionar o filme de destaque
    const [featuredData, setFeaturedData] = useState(null)
    //Aqui vamos fazer aparecer a classe, de acordo com alguma orientação
    const [blackHeader, setBlackHeader] = useState(false)

//useEffect é um comando para "executar ao iniciar", aqui, estamos pegando as informações totais dos filmes,
// obtidas na função getHomelist em Tmdb.js
  useEffect(() => {
    const loadAll = async () => {
      let list = await Tmdb.getHomelist();
      setMovielist(list);
     
      //Aqui vamos usar a mesma lista ja importada acima Featured
      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

      setFeaturedData(chosenInfo);
    }
    loadAll();
  }, []);
 //Aqui vamos usar um novo useEffect, para verificar o scroll de rolagem ? > 10 = true : false;
  useEffect(() => { 
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      }else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);
 
  //.map() vai fazer o loop dentro da array para verificar os itens
  //Aqui estão as listas dos filmes.(abaixo)
  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData &&
       < FeaturedMovie item={featuredData} />
       
      }

      <section className="lists">
        {movieList.map((item, key) =>(
         <MovieRow key={key} title={item.title} items={item.items}/>
       ))}
      </section>
      <footer>
        Powered By:Dev.FelipeDiogo<br/>
        Este site é um clone do site da NetFlix, feito em React Js<br/>
        TMDB.org API filmes<br/>
        Todos os direitos reservados
      </footer>
          {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
      </div>
}
      </div>
  );
}