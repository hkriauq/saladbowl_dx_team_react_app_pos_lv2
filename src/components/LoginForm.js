import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'; 


function LoginForm() {
  const initialValues = {  mailAddress: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    // console.log(e.target.name);
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // console.log(formValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    setIsSubmit(true);
    // バリデーションエラーがない場合に画面遷移
    if (Object.keys(errors).length === 0) {
      navigate('/app');
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    } else {
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const regex2 =
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

    //valueが空ならerrorsの配列に入れる
    if (!values.mailAddress) {
      errors.mailAddress = "メールアドレスを入力してください";
    } else if (!regex2.test(values.mailAddress)) {
      errors.mailAddress = "正しいメールアドレスを入力してください";
    } else if (values.mailAddress.length > 225) {
      errors.mailAddress = "メールアドレスは225文字以下で入力してください";
    }
    if (!values.password) {
      errors.password = "パスワードを入力してください。";
    } else if (values.password.length < 4) {
      errors.password = "4文字以上15文字以下のパスワードを入力してください";
    } else if (values.password.length > 15) {
      errors.password = "4文字以上15文字以下のパスワードを入力してください";
    }
    return errors;
  };

  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit}>
        <h2>ログイン</h2>
        <hr />
        <div className="uiForm">
          <div className="formField">
            <label>メールアドレス</label>
            <input
              type="text"
              name="mailAddress"
              placeholder="メールアドレス"
              value={formValues.mailAddress}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <p className="errorMsg">{formErrors.mailAddress}</p>

          <div className="formField">
            <label>パスワード</label>
            <input
              type="password"
              name="password"
              placeholder="パスワード"
              value={formValues.password}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <p className="errorMsg">{formErrors.password}</p>
          {Object.keys(formErrors).length === 0 && isSubmit && (
            <div className="msgOk">ログインに成功しました</div>
          )}
          <Button
            type = 'submit'
            className="submitButton"
     
          >ログイン</Button>

        <Button onClick={() => navigate('/signup')}>新規登録</Button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;