import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Container, Owner, Loading, BackButton } from "./styles";
import { FaArrowCircleLeft }from 'react-icons/fa';

export default function Repositorio({match}){
    const [repositorio, setRepositorio] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
  


    useEffect(()=>{
        async function load(){
            const nomeRepo = decodeURIComponent(match.params.repositorio)

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params:{
                        state: 'open',
                        per_page: 5
                    }
                })
            ]);

            setRepositorio(repositorioData.data)
            console.log(repositorioData.data)
            setLoading(false)
        }

        load()
    }, [match.params.repositorio])

    if(loading){
        return(
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }

    return(
        <Container>
            <BackButton to="/">
                <FaArrowCircleLeft color="#FFF" size={30}/>
            </BackButton>
           <Owner>
                <img
                 src={repositorio.owner.avatar_url}
                 alt={repositorio.owner.login}
                 />
                 <h1>{repositorio.name}</h1>
                 <p>{repositorio.description}</p>
           </Owner>
        </Container>
    )
}