import CryptoJS from "crypto-js";

// encrypt some bytes

export async function verifyUser(email, password) {
  console.log(email, password);
  let res = await fetch(
    "https://db-verification-52w2kdqg9-rdj.vercel.app/verifyuser",
    {
      headers: {
        email: email,
        password: password,
      },
    }
  );
  let data = await res.json();
  console.log(data);
  if (data._id) {
    const encryptedMessage = CryptoJS.AES.encrypt(
      email + "::" + password,
      "test"
    ).toString();
    localStorage.setItem("userdetails", encryptedMessage);
    return data;
  } else return false;
}

export async function createUser(email, password) {
  let res = await fetch(
    "https://db-verification-52w2kdqg9-rdj.vercel.app/createuser",
    {
      method: "POST",
      headers: {
        email: email,
        password: password,
      },
    }
  );
  let data = await res.json();
  if (data._id) {
    const encryptedMessage = CryptoJS.AES.encrypt(
      email + "::" + password,
      "test"
    ).toString();
    localStorage.setItem("userdetails", encryptedMessage);
    return data;
  } else return false;
}
