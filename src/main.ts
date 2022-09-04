import './style.css'
import {Validator} from "./Validator";
import {required} from "./rules/required";
import {length} from "./rules/length";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
  <form action="">
    <label for="name">name</label>
  <input type="text" name="name" id="name">
  <button type="submit">submit</button>
</form>
  </div>
`

const form = document.querySelector('form')!
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form);
    const data: Record<string, string> = {name: "name", phone: '0123456789'}
    for (const key in data) {
        formData.append(key, data[key])
    }

    const validator = new Validator(formData)
    validator.addRule('required', required)
    validator.addRule('length', length, 10)

    validator.setRules('name', ['required', 'length'])

    validator.validate()
})
