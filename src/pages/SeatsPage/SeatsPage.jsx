import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SeatsPage() {
  const [seat, setSeat] = useState({ seats: [] });
  const [movie, setMovie] = useState([]);
  const [day, setDay] = useState([]);
  const [section, setSection] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [selectedSeatArr, setSelectedSeatArr] = useState([]);
  const [selectedSeatId, setSelectedSeatId] = useState([]);
  const [name, setName] = useState("");
  const [CPF, setCPF] = useState("");
  const { idSession } = useParams();

  useEffect(() => {
    const urlSeats = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSession}/seats`;
    const promise = axios.get(urlSeats);

    promise
      .then((res) => {
        setSeat(res.data);
        setMovie(res.data.movie);
        setDay(res.data.day);
        setSection(res.data);
      })
      .catch((err) => console.log(err.response.data));
  }, []);

  function reserveSeat(s) {
    if (!s.isAvailable) {
      alert("Esse assento não está disponível");
    } else {
      if (selectedSeatArr.includes(s.id)) {
        setSelectedSeat(selectedSeatId.filter((index) => index !== s.id));
        setSelectedSeatArr(selectedSeatArr.filter((index) => index !== s.id));
      } else {
        setSelectedSeatId([...selectedSeatArr, s.id]);
      }
    }
  }

  return (
    <PageContainer>
      Selecione o(s) assento(s)
      <SeatsContainer>
        {seat.seats.map((s) => (
          <SeatItem
            data-test="seat"
            key={s.id}
            onClick={() => reserveSeat(s)}
            isAvailable={s.isAvailable}
            isSelected={selectedSeatId.includes(s.id)}
          >
            {s.name}
          </SeatItem>
        ))}
      </SeatsContainer>

      <CaptionContainer>
        <CaptionItem>
          <CaptionCircle type="selecionado" />
          Selecionado
        </CaptionItem>
        <CaptionItem>
          <CaptionCircle type="disponivel" />
          Disponível
        </CaptionItem>
        <CaptionItem>
          <CaptionCircle type="indisponivel" />
          Indisponível
        </CaptionItem>
      </CaptionContainer>

      <FormContainer>
        Nome do Comprador:
        <input data-test="client-name" placeholder="Digite seu nome..." />

        CPF do Comprador:
        <input data-test="client-cpf" placeholder="Digite seu CPF..." />

        <button data-test="book-seat-btn">Reservar Assento(s)</button>
      </FormContainer>

      <FooterContainer data-test="footer">
        <div>
          <img src={movie.posterURL} alt="poster" />
        </div>
        <div>
          <p>{movie.title}</p>
          <p>
            {day.weekday} - {section.name}
          </p>
        </div>
      </FooterContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Roboto";
  font-size: 24px;
  text-align: center;
  color: #293845;
  margin-top: 30px;
  padding-bottom: 120px;
  padding-top: 70px;
`;

const SeatsContainer = styled.div`
  width: 330px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const FormContainer = styled.div`
  width: calc(100vw - 40px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0;
  font-size: 18px;
  button {
    align-self: center;
  }
  input {
    width: calc(100vw - 60px);
  }
`;

const CaptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 300px;
  justify-content: space-between;
  margin: 20px;
`;

const CaptionCircle = styled.div`
  border: 1px solid
    ${(props) =>
      props.type === "selecionado"
        ? "#0e7d71"
        : props.type === "disponivel"
        ? "#7b8b99"
        : props.type === "indisponivel"
        ? "#f7c52b"
        : "none"};
  background-color: ${(props) =>
    props.type === "selecionado"
      ? "#1aae9e"
      : props.type === "disponivel"
      ? "#c3cfd9"
      : props.type === "indisponivel"
      ? "#fbe192"
      : "none"};
  height: 25px;
  width: 25px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 3px;
`;

const CaptionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
`;

const SeatItem = styled.div`
  border: 1px solid
    ${(props) =>
      !props.isAvailable ? "#f7c52b" : props.isSelected ? "#0e7d71" : "#7b8b99"};
  background-color: ${(props) =>
    !props.isAvailable ? "#fbe192" : props.isSelected ? "#1aae9e" : "#c3cfd9"};
  height: 25px;
  width: 25px;
  border-radius: 25px;
  font-family: "Roboto";
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 3px;
`;

const FooterContainer = styled.div`
  width: 100%;
  height: 120px;
  background-color: #c3cfd9;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
  position: fixed;
  bottom: 0;

  div:nth-child(1) {
    box-shadow: 0px 2px 4px 2px #0000001a;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    margin: 12px;
    img {
      width: 50px;
      height: 70px;
      padding: 8px;
    }
  }

  div:nth-child(2) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    p {
      text-align: left;
      &:nth-child(2) {
        margin-top: -10px;
        color: #7b8b99;
      }
    }
  }
`;