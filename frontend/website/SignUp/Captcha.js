import ReCAPTCHA from "react-google-recaptcha";

function Captcha({ onChange }) {
  const handleCaptchaChange = (value) => {
    onChange(value);
  };

  return (
    <ReCAPTCHA
      sitekey="YOUR_RECAPTCHA_SITE_KEY"
      onChange={handleCaptchaChange}
    />
  );
}

export default Captcha;
