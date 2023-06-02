import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import "./App.css";
import notFoundImg from "./assets/not-found.png";
import searchIcon from "./assets/search-icon.svg";

//Styles
const Container = styled.div`
  max-width: 1920px;
  width: 60%;
  margin: 0 auto;
  padding: 24px 0;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  max-width: 130px;
  padding: 0 12px;
  font-size: 12px;
  background-color: transparent;
  color: #222;
  border: 2px solid #f1f3f6;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #fec900;
  }
  &:active {
    border-color: #f1f3f6;
  }

  &:disabled {
    border: 2px solid #f1f3f6 !important;
    color: #8f99a7 !important;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;

  width: 100%;
`;

const TopSection = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
`;

const Cont = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  width: 100%;
`;

const ResultGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 24px;
  grid-row-gap: 24px;
  justify-content: center;
  justify-items: center;
  margin-top: 40px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 992px) {
    grid-column-gap: 16px;
    grid-row-gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ProductLi = styled.a`
  background-color: #ffffff;
  padding: 8px;
  border-radius: 8px;
  border: 2px solid #f1f3f6;
  cursor: pointer;
  transition: all 0.2s ease;

  max-width: 360px;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;

  &:hover {
    border-color: #fec900;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TitleH = styled.h3`
  font-size: 16px;
  flex: 1;
  margin-bottom: 16px;
`;

const Text = styled.p`
  font-size: 14px;
  font-weight: bold;
`;

const TextWarn = styled.h4`
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  margin-bottom: 16px;

  display: flex;
  justify-content: center;
  gap: 4px;
`;

const TextWarnMM = styled.h4`
  font-weight: bold;
`;

const TextEmpty = styled.p`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 80px;
`;

const Price = styled.span`
  font-size: 14px;
  font-weight: normal;
`;

const ProductImage = styled.img`
  width: 340px;
  height: 267px;
`;

const NotFoundImage = styled.img`
  width: 340px;
  height: 267px;
`;

const Input = styled.input`
  max-width: 240px;
  width: 100%;
  height: 40px;
  background-color: rgba(244, 244, 244, 0.6);
  border-radius: 12px;
  text-align: left;
  text-indent: 16px;
  padding-right: 16px;
  border: 2px solid #f1f3f6;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #fec900;
  }
  &:hover {
    border-color: #fec90080;
  }
`;

const Search = styled.div`
  position: relative;

  max-width: 400px;
  width: 100%;
  height: 40px;
`;

const SearchButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translate(0, -50%);
  padding-left: 16px;

  background-color: transparent;
  color: #222;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.5;
  }

  &:hover {
    img {
      opacity: 0.6;
    }
  }

  &:active {
    img {
      opacity: 0.8;
    }
  }
`;

const SearchInput = styled.input`
  max-width: 400px;
  width: 100%;
  height: 40px;
  background-color: rgba(244, 244, 244, 0.6);
  border-radius: 12px;
  text-align: left;
  text-indent: 16px;
  padding-right: 16px;
  border: 2px solid #f1f3f6;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #fec900;
  }
  &:hover {
    border-color: #fec90080;
  }
  &::placeholder {
    font-weight: bold;
  }
`;

//Search component
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [accesToken, setAccessToken] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);
      setError("");

      if (!email || !password) {
        setError("please fill your information");
        return;
      }

      const response = await axios.post(
        "https://accounts.tnet.ge/api/ka/user/auth",
        {
          Email: email,
          Password: password,
        }
      );

      const token = response?.data?.data?.access_token;
      const userInfo = response?.data?.data?.Data;

      setUser(userInfo);
      setAccessToken(token);
      setSubmitClicked(false);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));
    } catch (e) {
      setError(e.response.data.message.error_data._error[0]);
    }
  };

  const handleSearch = async () => {
    if (keyword.length > 5) {
      try {
        setIsLoading(true);

        const response = await axios.post(
          "https://api2.mymarket.ge/api/ka/products",
          {
            Keyword: keyword,
          }
          // {
          //   headers: {
          //   },
          // }
        );
        console.log(response.data.data.Prs);
        setSearchResults(response.data.data.Prs);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAccessToken(null);
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = JSON.parse(localStorage.getItem("user"));

    if (u) {
      setUser(u);
    }

    if (t) {
      setAccessToken(t);
    }
  }, [accesToken]);

  useEffect(() => {
    if (email && password) {
      if (password.length > 6) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  const handleClickProduct = (productId) => {
    window.open(`https://www.mymarket.ge/pr/${productId}`, "_blank");
  };

  return (
    <>
      {user ? (
        <>
          <TopSection>
            <Container>
              <Cont>
                <div>
                  {user.user_name} {user.user_surname}
                </div>
                <Button onClick={() => logout()}>Logout</Button>
              </Cont>
              <div>
                <Form onSubmit={handleClick}>
                  <Search>
                    <SearchInput
                      type="text"
                      placeholder="mymarket"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                    <SearchButton type="submit" onClick={handleSearch}>
                      <img src={searchIcon} alt="Search" />
                    </SearchButton>
                  </Search>
                  {submitClicked && keyword.length <= 5 && (
                    <Text>Please enter more than 5 characters</Text>
                  )}
                </Form>
              </div>
            </Container>
          </TopSection>
          <Container>
            {searchResults.length > 0 && (
              <ResultGrid>
                {searchResults.map((result, index) => (
                  <ProductLi
                    key={index}
                    onClick={() => handleClickProduct(result.product_id)}
                  >
                    {result.photos.length > 0 && result.photos[0].forEdit ? (
                      <ProductImage
                        src={result.photos[0].forEdit}
                        alt={result.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = { notFoundImg };
                        }}
                      />
                    ) : (
                      <NotFoundImage src={notFoundImg} alt="Not Found" />
                    )}
                    <TitleH>{result.title}</TitleH>
                    <Text>
                      Price: {result.price} <Price>₾</Price>
                    </Text>
                  </ProductLi>
                ))}
              </ResultGrid>
            )}
            {submitClicked && !isLoading && searchResults.length === 0 && (
              <TextEmpty>THE DESIRED PRODUCT COULD NOT BE FOUND</TextEmpty>
            )}
          </Container>
        </>
      ) : (
        <TopSection>
          <Container>
            <TextWarn>
              Enter <TextWarnMM>Mymarket.ge</TextWarnMM> Email and Password
            </TextWarn>
            <Form onSubmit={handleClick}>
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button disabled={disabled} type="submit">
                Submit
              </Button>
              <p
                style={{
                  color: "red",
                }}
              >
                {error}
              </p>
            </Form>
          </Container>
        </TopSection>
      )}
    </>
  );
}

export default App;
