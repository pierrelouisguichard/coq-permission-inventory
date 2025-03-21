import React from "react";
import styled from "styled-components";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

/**
 * Renders a sign-in button using redirect
 */
export const SignInButton = () => {
  const { instance } = useMsal();

  const handleRedirectLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  return <ButtonStyled onClick={handleRedirectLogin}>Sign In</ButtonStyled>;
};

/**
 * Renders a sign-out button using redirect
 */
export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleRedirectLogout = () => {
    instance
      .logoutRedirect({
        postLogoutRedirectUri: "/",
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <ButtonStyled onClick={handleRedirectLogout} className="no-print">
      Sign Out
    </ButtonStyled>
  );
};

const ButtonStyled = styled.button`
  font-weight: bold;
  background-color: white;
  color: #a88c7c;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 0.5rem;

  &:hover {
    background-color: #e3cfb6;
  }
`;
