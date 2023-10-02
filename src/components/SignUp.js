import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'; 


function SignUp() {
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
    //エラーなしでかつ送信されているなら。
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    } else {
    }
  }, [formErrors]);

  //バリデーションチェック
  const validate = (values) => {
    const errors = {};
    //半角英数字のみ(空文字OK)
    const regex =
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    //valueが空ならerrorsの配列に入れる。
    if (!values.username) {
      errors.username = "ユーザー名を入力してください。";
    }
    if (!values.mailAddress) {
      errors.mailAddress = "メールアドレスを入力してください。";
    } else if (!regex.test(values.mailAddress)) {
      errors.mailAddress = "正しいメールアドレスを入力してください";
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
            <label>ユーザー名</label>
            <input
              type="text"
              name="username"
              placeholder="ユーザー名"
              value={formValues.username}
              onChange={(e) => handleChange(e)}
            />
          </div><p className="errorMsg">{formErrors.username}</p>

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
     
          >登録</Button>

        </div>
      </form>
    </div>
  );
}

export default SignUp;
