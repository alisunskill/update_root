import ReCAPTCHA from "react-google-recaptcha";
import { sitekey } from "../../apiConfig";
function Captcha({ onChange }) {
  const handleCaptchaChange = (value) => {
    onChange(value);
  };

  return (
    <ReCAPTCHA
      sitekey={sitekey}
      onChange={handleCaptchaChange}
    />
  );
}

export default Captcha;
