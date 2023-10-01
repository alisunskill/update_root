import ReCAPTCHA from "react-google-recaptcha";

function Captcha({ onChange }) {
  const handleCaptchaChange = (value) => {
    onChange(value);
  };

  return (
    <ReCAPTCHA
      sitekey="6LdNryEnAAAAAHvI4ty3RvMc2dnX0fR9aF1dXq7r"
      onChange={handleCaptchaChange}
    />
  );
}

export default Captcha;
