class Validator {

  // public fields
  RULE_LENGTH = 'length';
  RULE_ALPHANUMERIC = 'alphanumeric';
  RULE_UPPER_LOWER_CASE = 'upperLowerCase';
  RULE_NUMBER_SYMBOL = 'numberSymbol';
  RULE_EMAIL = 'email';
  RULE_UNIQUENESS = 'uniqueness';

  length(input, min, max = null) {
    if (max !== null && (input.length < min || input.length > max)) return false;
    else if (max === null && input.length < min) return false;
    else return true;
  }

  alphanumeric(input) {
    if (/[^\w]/.test(input)) return false;
    else return true;
  }

  specialCharacters(input) {
    if (/[!@#$%^&*()+={}\];:'",<.>?]/.test(input)) return false;
    else return true;
  }

  upperLowerCase(input) {
    if (/(?=.*[A-Z])(?=.*[a-z])/.test(input)) return true;
    else return false;
  }

  numberSymbol(input) {
    if (/(?=.*[0-9_])/.test(input)) return true;
    else return false;
  }

  email(input) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(input)) 
      return true;
    else return false;  
  }

  uniqueness(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.onerror = () => reject('Server not responding.');
      xhr.onload = () => {

        if (xhr.status === 200 && xhr.readyState === 4) {
          resolve(xhr.responseText);
        } else {
          reject('Wrong server response headers.');
        }
      };
      xhr.open('GET', url);
      xhr.send();
    });
  }
}

export default Validator;