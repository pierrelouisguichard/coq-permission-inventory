import React from "react";
import styled from "styled-components";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton, SignOutButton } from "./SignInOutButtons";
import logo from "../assets/logo.png";

export const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated();
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", {
    month: "short",
  });
  const currentYear = currentDate.getFullYear();

  return (
    <>
      <StyledNavbar>
        <NavbarLeft>
          <Logo src={logo} alt="Coquillade Logo" />
          <Title>
            Coquillade: New Server Structure {currentMonth} {currentYear}
          </Title>
        </NavbarLeft>
        <NavbarRight>
          {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </NavbarRight>
      </StyledNavbar>
      <MainContent>{props.children}</MainContent>
    </>
  );
};

const StyledNavbar = styled.nav`
  background-color: #a88c7c;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavbarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const NavbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin: 0;
  margin-left: 1rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const Logo = styled.img`
  height: 70px;
  border-radius: 8px;
`;

const MainContent = styled.main`
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
  font-family: "Arial", sans-serif;
  color: #333;
`;
