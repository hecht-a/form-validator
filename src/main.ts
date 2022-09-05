import './style.css'
import {Validator} from "./Validator";
import {required} from "./rules/required";
import {length} from "./rules/length";

const form = document.querySelector('form')!
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form);

    const validator = new Validator(formData)
    validator.addRule('required', required)
    validator.addRule('length', length, 10)

    validator.setRules('name', ['required', 'length'])
    validator.setRules('firstname', ['required', 'length'])
    validator.initErrorMessages({
        required: 'Le champ {champ} est requis',
        length: "Le champ {champ} est trop long"
    })

    validator.validate()

    console.log(validator.errors)
})
