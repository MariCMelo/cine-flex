import styled from "styled-components"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage() {
    const [image, setImage] = useState([]);
    const [error, setError] = useState(null);
    const urlMovies = "https://mock-api.driven.com.br/api/v8/cineflex/movies";
    useEffect(() => {
        const promise = axios.get(urlMovies);

        promise
            .then((res) => {
                setImage(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                setError(err.response.data);
                console.log(err.response.data);
            });
    }, []);

    return (
        <PageContainer>
            Selecione o filme

            {error ? (
                <p>Erro ao carregar filmes.</p>
            ) : (
                <ListContainer>
                    {image.map((img) => (
                        <Link to={`/sessoes/${img.id}`} key={img.id}>
                            <MovieContainer data-test="movie">
                                <img src={img.posterURL} alt="poster" />
                            </MovieContainer>
                        </Link>
                    ))}
                </ListContainer>
            )}
        </PageContainer>
    );
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-top: 70px;
`
const ListContainer = styled.div`
    width: 330px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 10px;
`
const MovieContainer = styled.div`
    width: 145px;
    height: 210px;
    box-shadow: 0px 2px 4px 2px #0000001A;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    img {
        width: 130px;
        height: 190px;
    }
`