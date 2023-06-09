import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from "./styles";
import { FaArrowCircleLeft }from 'react-icons/fa';
import { useParams } from "react-router-dom";


export default function Repositorio({match}){
    const [repositorio, setRepositorio] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        {state: 'all', label: 'Todas', active: true},
        {state: 'open', label: 'Abertas', active: false},
        {state: 'closed', label: 'Fechadas', active: false}
        ])
    const [filterIndex, setFilterIndex] = useState(0)

    const {repositorio: rep} = useParams()


    useEffect(()=>{
        async function load(){
            const nomeRepo = decodeURIComponent(rep)

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params:{
                        state: filters.find(f => f.active).state,
                        per_page: 5
                    }
                })
            ]);

            setRepositorio(repositorioData.data)
            setIssues(issuesData.data)
            setLoading(false)
        }

        load()
    }, [filters, rep])


    useEffect(() =>{
        async function loadIssue(){
            const nomeRepo = decodeURIComponent(rep)

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params:{
                    state: filters[filterIndex].state,
                    page, //se tiver o mesmo nome não precisa repetir
                    per_page: 5,
                }
            })

            setIssues(response.data)
            console.log(filterIndex)
        }

        loadIssue()
    }, [filterIndex, filters, rep, page])

    function handlePage(action){
        setPage(action === 'back' ? page -1 : page + 1)
    }

    function handleFilte(index){
        setFilterIndex(index)
        setPage(1)
    }

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

           <FilterList active = {filterIndex}>
                {filters.map((filter, index) =>
                    <button
                    type="button"
                    key={filter.label}
                    onClick={() => handleFilte(index)}
                    >
                        {filter.label}
                    </button>
                )}
           </FilterList>

           <IssuesList>
            {issues.map(issue =>(
                <li key={String(issue.id)}>
                    <img src={issue.user.avatar_url} alt={issue.user.login}/>

                    <div>
                        <strong>
                            <a href={issue.html_url}>{issue.title}</a>

                            {issue.labels.map(label => (
                                <span key={String(label.id)}>{label.name}</span>
                            ))}
                        </strong>

                        <p>{issue.user.login}</p>
                    </div>

                </li>
            ))}
           </IssuesList>

           <PageActions>
            <button type="button" onClick={()=> handlePage('back')} disabled={page < 2}>
                Voltar
            </button>
            <button type="button" onClick={()=> handlePage('next')}>
                Proxima
            </button>
           </PageActions>
        </Container>
    )
}
