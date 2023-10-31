import React from 'react';
import { useRouter } from "next/navigation";

const ThanksPage = () => {
  const router = useRouter();

  const containerStyle = {
    background: 'url("/images/ThanksForAdding.png") center/cover no-repeat',
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover', // Ensure the background image covers the container
  };


  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20%'
  };

  const buttonStyle = {
    padding: '5px 10px',
    background: '#4562B2',
    color: '#FFFFFF',
    borderRadius: '10px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Poppins', // Adding "Poppins" as the preferred font with a fallback to sans-serif
    borderColor:'#4562B2',
    borderStyle:'none'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{
        color: '#04104C',
        fontWeight: 'bold',
        fontSize: '43px',textAlign:'center'
      }}>Thanks for sharing!</h1>
      <div style={buttonContainerStyle}>
        <button onClick={() => {
          router.push("/");
        }} style={buttonStyle}>
          Back to Home
        </button>
        <button onClick={() => {
          router.push("/createposts");
        }} style={buttonStyle}>
          Recommend More
        </button>
      </div>
    </div>
  );
};

export default ThanksPage;
