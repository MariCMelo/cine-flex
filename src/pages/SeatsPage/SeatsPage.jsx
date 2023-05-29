import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

export default function SeatsPage({ setSuccessInfo }) {
  const [seat, setSeat] = useState({ seats: [] });
  const [movie, setMovie] = useState([]);
  const [day, setDay] = useState([]);
  const [section, setSection] = useState([]);
  const [selectedSeatArr, setSelectedSeatArr] = useState([]);
  const [form, setForm] = useState({ name: "", cpf: "" });
  const { idSession } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urlSeats = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSession}/seats`;

    axios
      .get(urlSeats)
      .then((res) => {
        setSeat(res.data);
        setMovie(res.data.movie);
        setDay(res.data.day);
        setSection(res.data);
      })
      .catch((err) => console.log(err.response.data));
  }, [idSession]);

  function reserveSeat(selectedSeat) {
    if (!selectedSeat.isAvailable) {
      alert("Esse assento não está disponível");
    } else {
      const isSelected = selectedSeatArr.some((seat) => seat.id === selectedSeat.id);

      if (isSelected) {
        const updatedSeatArr = selectedSeatArr.filter((seat) => seat.id !== selectedSeat.id);
        setSelectedSeatArr(updatedSeatArr);
      } else {
        setSelectedSeatArr([...selectedSeatArr, selectedSeat]);
      }
    }
  }

  function buyTicket(e) {
    e.preventDefault();

    const urlBuy = `https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many`;
    const ids = selectedSeatArr.map((s) => s.id);
    const body = { ...form, ids };

    axios
      .post(urlBuy, body)
      .then(() => {
        const info = {
          movie: movie.title,
          date: day.date,
          hour: section.name,
          buyer: form.name,
          cpf: form.cpf,
          seats: selectedSeatArr.map((s) => s.name)
        };
        console.log(info)
        setSuccessInfo(info);
        navigate("/sucesso");
      })
      .catch((err) => alert(err.response.data.message));
  }
  function handleInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <PageContainer>
      <SeatsContainer>
        {seat.seats.map((s) => (
          <SeatItem
            data-test="seat"
            key={s.id}
            onClick={() => reserveSeat(s)}
            isAvailable={s.isAvailable}
            isSelected={selectedSeatArr.some((seat) => seat.id === s.id)}
          >
            {s.name}
          </SeatItem>
        ))}
      </SeatsContainer>

      <CaptionContainer>
        <CaptionItem>
          <CaptionCircle status={"selected"} />
          Selecionado
        </CaptionItem>
        <CaptionItem>
          <CaptionCircle status={"available"} />
          Disponível
        </CaptionItem>
        <CaptionItem>
          <CaptionCircle status={"unavailable"} />
          Indisponível
        </CaptionItem>
      </CaptionContainer>

      <form onSubmit={buyTicket}>
        <FormContainer >

          <label htmlFor="name">Nome do Comprador:</label>
          <input
            data-test="client-name"
            id="name"
            placeholder="Digite seu nome..."
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="cpf">CPF do Comprador:</label>
          <input
            data-test="client-cpf"
            id="cpf"
            placeholder="Digite seu CPF..."
            name="cpf"
            value={form.cpf}
            onChange={handleInputChange}
            required
          />

          <button type="submit" data-test="book-seat-btn">Reservar Assento(s)</button>
        </FormContainer>
      </form>


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
    props.status === "selected"
      ? "#0e7d71"
      : props.status === "available"
        ? "#7b8b99"
        : props.status === "unavailable"
          ? "#f7c52b"
          : "none"};
  background-color: ${(props) =>
    props.status === "selected"
      ? "#1aae9e"
      : props.status === "available"
        ? "#c3cfd9"
        : props.status === "unavailable"
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