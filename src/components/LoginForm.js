import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';


function LoginForm() {
  const initialValues = {  mailAddress: "" , password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [usrName,setUsrName] = useState(false);
  const navigate = useNavigate();

  //フォームの入力が変更されたときにformValuesを更新、保存
  const handleChange = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  };

  //FastAPIが準備できるまでの仮対応！ 
  //const handleSubmit = (e) => {
    //e.preventDefault();
    //const errors = validate(formValues);
    //setFormErrors(errors);
    //setIsSubmit(true);
    //// バリデーションエラーがない場合に画面遷移
    //if (Object.keys(errors).length === 0) { 
      //navigate('/app');
    //}
  //};

  //FastAPIが準備できたら下記に切り替え！  
  const api_postUrl =  "http://localhost:8000/login/";

  // ポスト処理　True:/appへ画面遷移、False:エラー処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(api_postUrl, formValues);
      const result = response.data;
      if (result.check) {
        const usrName = result.usr_name; // responseでusr_nameの値を取得
        navigate('/app');
        setUsrName(usrName);
      } else {
        console.error("POSTエラー");
      }
    } catch (error) {
      console.error('リクエストエラー:', error);
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
      errors.password = "4文字以上64文字以下のパスワードを入力してください";
    } else if (values.password.length > 64) {
      errors.password = "4文字以上64文字以下のパスワードを入力してください";
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

        <Button onClick={() => navigate('/')}>新規登録</Button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;