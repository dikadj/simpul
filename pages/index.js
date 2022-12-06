// import Head from 'next/head'
// import Image from 'next/image'
// import '../styles/Home.module.css'

import React, { useState, useEffect, use } from "react"
import axios from "axios"
import Select from "react-select"
import $ from "jquery"

import { useRouter } from "next/router"

// Datepicker
import Datepicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
// import Datepicker from "react-date-picker"

// AdminLTE
import "admin-lte/dist/css/adminlte.min.css"
// import "admin-lte/dist/js/adminlte.min.js"

// Common Helpers
const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const snakeToCamel = str => str.toLowerCase().replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '')
      .replace('_', '')
  )


// Employer or School Selector Helpers

const selectNextEmployerOrSchool = (e) => $(`div[data-number="${$(e.currentTarget).parent().parent().data().number+1}"]`)
const selectCurrentEmployerOrSchoolRemoveButton = (e) => $(`div[data-number="${$(e.currentTarget).parent().parent().data().number}"] button.remove_employer_or_school_button_${$(e.currentTarget).parent().parent().data().number}`)
const selectPreviousEmployerOrSchoolAddButton = (e) => $(`div[data-number="${$(e.currentTarget).parent().parent().data().number-1}"] button.add_employer_or_school_button_${$(e.currentTarget).parent().parent().data().number-1}`)
const selectPreviousEmployerOrSchoolRemoveButton = (e) => $(`div[data-number="${$(e.currentTarget).parent().parent().data().number-1}"] button.remove_employer_or_school_button_${$(e.currentTarget).parent().parent().data().number-1}`)
const employerOrSchoolScrollPosition = (e, direction) => $(`div[data-number="${$(e.currentTarget).parent().parent().data().number + direction}"]`)
const scrollToPrevEmployerOrSchool = (e) => !employerOrSchoolScrollPosition(e, -1).hasClass("d-none") ? $('html,body').animate({ scrollTop: employerOrSchoolScrollPosition(e, -1).offset().top }, 'easeInOutQuad') : $('html,body').animate({ scrollTop: employerOrSchoolScrollPosition(e, -2).offset().top }, 'easeInOutQuad')
const scrollToNextEmployerOrSchool = (e) => $('html,body').animate({ scrollTop: employerOrSchoolScrollPosition(e, 1).offset().top }, 'easeInOutQuad')

// Components

const NameFields = ({ className="", children, label="", firstNameId="firstName", middleNameId="middleName", lastNameId="lastName", firstName="", middleName="", lastName="", handleFirstName={function(){}}, handleMiddleName={function(){}}, handleLastName={function(){}} }) => (
  <div className={`form-group ${className}`}>
    <label>{label}</label>
    <div className="row">
      <div className="col-4">
        <input type="text" className="form-control" id={firstNameId} placeholder="First Name" name={camelToSnakeCase(firstNameId)} value={firstName} onChange={handleFirstName} />
      </div>
      <div className="col-4">
        <input type="text" className="form-control" id={middleNameId} placeholder="Middle Name" name={camelToSnakeCase(middleNameId)} value={middleName} onChange={handleMiddleName} />
      </div>
      <div className="col-4">
        <input type="text" className="form-control" id={lastNameId} placeholder="Last Name" name={camelToSnakeCase(lastNameId)} value={lastName} onChange={handleLastName} />
      </div>
      {children}
    </div>
  </div>
)

const PhoneNumber = ({ className, id, onChange, value, label, disabled, children }) => (
  <div className={`form-group col-6 ${className}`}>
    <label htmlFor={id}>{label}</label>
    <input type="tel" className="form-control" id={id} placeholder="e.g. 123-456-7890" onChange={onChange} name={camelToSnakeCase(id)} value={value} disabled={disabled} />
    {children}
  </div>
)

const CheckboxItem = ({ className="", id, onChange, checked, label, number }) => (
  <div className={className}>
    <div className="form-check mt-1">
      <input type="checkbox" className="form-check-input" id={id} onChange={onChange} checked={checked} data-number={number} />
      <label className="form-check-label" htmlFor={id}>{label}</label>
    </div>
  </div>
)

const EmployerOrSchool = ({ label="Employer/School", number=1, className="", children }) => {
  const [isCurrentlyWorkingHere, setIsCurrentlyWorkingHere] = useState(false)

  const handleIsCurrentlyWorkingHere = (e) => { setIsCurrentlyWorkingHere(!isCurrentlyWorkingHere), $(`#employer_or_school_${number}_address_end_date, #present_text_${number}`).toggleClass("d-none") }
  return (
    <div className={`row ${className}`} id={`employer_or_school_${number}`} data-number={number}>
      <div className="col-12">
        <label htmlFor="">{label}</label>
      </div>
      <div className="col-8 pb-3">
        <input type="name" className="form-control" id={`employer_or_school_${number}_name`} name={`employer_or_school_${number}_name`} placeholder="Employer/School Name" />
      </div>
      <div className="col-4 pb-3">
        <input type="occupation" className="form-control" id={`employer_or_school_${number}_occupation`} name={`employer_or_school_${number}_occupation`}placeholder="Occupation" />
      </div>
      <div className="col-12 pb-3">
        <input type="street" className="form-control" id={`employer_or_school_${number}_address_street`} name={`employer_or_school_${number}_address_street`}placeholder="Street Address" />
      </div>
      <div className="col-2 pb-3">
        <input type="street" className="form-control" id={`employer_or_school_${number}_address_extra`} name={`employer_or_school_${number}_address_extra`} placeholder="Ext." />
      </div>
      <div className="col-2 pb-3">
        <input type="address_number" className="form-control" id={`employer_or_school_${number}_address_number`} name={`employer_or_school_${number}_address_number`} placeholder="No." />
      </div>
      <div className="col-4 pb-3">
        <input type="city" className="form-control" id={`employer_or_school_${number}_address_city`} name={`employer_or_school_${number}_address_city`} placeholder="City" />
      </div>
      <div className="col-4 pb-3">
        <input type="state" className="form-control" id={`employer_or_school_${number}_address_state`} name={`employer_or_school_${number}_address_state`} placeholder="State/province" />
      </div>
      <div className="col-4 pb-3">
        <input type="zip" className="form-control" id={`employer_or_school_${number}_address_zip_code`} name={`employer_or_school_${number}_address_zip_code`} placeholder="Zip" />
      </div>
      <div className="col-4 pb-3">
        <input type="zip" className="form-control" id={`employer_or_school_${number}_address_zip_4`} name={`employer_or_school_${number}_address_zip_4`} placeholder="Zip+4" />
      </div>
      <div className="col-4 pb-3">
        <input type="country" className="form-control" id={`employer_or_school_${number}_address_country`} name={`employer_or_school_${number}_address_country`} placeholder="Country" />
      </div>
      <div className="col-6 pb-3">
        <label htmlFor={`employer_or_school_${number}_address_start_date`}>From:</label>
        <input type="date" className="form-control" id={`employer_or_school_${number}_address_start_date`} name={`employer_or_school_${number}_address_start_date`} placeholder="Start Date" />
      </div>
      <div className="col-6 pb-3">
        <label htmlFor={`employer_or_school_${number}_address_end_date`}>To:</label>
        <input type="date" className="form-control" id={`employer_or_school_${number}_address_end_date`} name={`employer_or_school_${number}_address_end_date`} placeholder="End Date" />
        <span id={`present_text_${number}`} className="form-control d-none">Present</span>
        <CheckboxItem id={`isCurrentlyWorkingHere${number}`} checked={isCurrentlyWorkingHere} onChange={handleIsCurrentlyWorkingHere} label="Currently working here" number={number} />
      </div>
      {children}
    </div>
  )
}

const MyBiodata = ({ className }) => {
    
  useEffect(() => {

    // Names of Countries
    axios.get("https://restcountries.com/v3.1/all")
      .then(function (response) {
        // handle success
        const countryNames = response.data.map(c => c.name.common).sort()
        setCountryNames(countryNames.map(c => ({ value: c.toLowerCase(), label: c })))
        // console.log(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  })

  const now = new Date()
  const legalAgeDate = new Date(now.getFullYear()-18, now.getMonth(), now.getDate())
  const maxAgeDate = new Date(now.getFullYear()-100, now.getMonth(), now.getDate())

  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthFirstName, setBirthFirstName] = useState("")
  const [birthMiddleName, setBirthMiddleName] = useState("")
  const [birthLastName, setBirthLastName] = useState("")
  const [otherFirstName1, setOtherFirstName1] = useState("")
  const [otherMiddleName1, setOtherMiddleName1] = useState("")
  const [otherLastName1, setOtherLastName1] = useState("")
  const [otherFirstName2, setOtherFirstName2] = useState("")
  const [otherMiddleName2, setOtherMiddleName2] = useState("")
  const [otherLastName2, setOtherLastName2] = useState("")
  const [hairColor, setHairColor] = useState("brown")
  const [race, setRace] = useState("white")
  const [selectedBirthdayDate, setSelectedBirthdayDate] = useState(legalAgeDate)
  const [countryNames, setCountryNames] = useState([])
  const [faxValue, setFaxValue] = useState("")
  const [phoneValue, setPhoneValue] = useState("")
  const [isFaxSameAsPhone, setIsFaxSameAsPhone] = useState(false)
  const [isSameAsBirthName, setIsSameAsBirthName] = useState(false)
  const [haveOtherNames, setHaveOtherNames] = useState(false)
  const [faxInputDisabled, setFaxInputDisabled] = useState(false)
  const [isForWorkNumberChecked, setIsForWorkNumberChecked] = useState(true)
  const [isForPrivateNumberChecked, setIsForPrivateNumberChecked] = useState(false)
  const [employerOrSchoolNumberAdded, setEmployerOrSchoolNumberAdded] = useState(1)
  
  const handleFirstName = (e) => { setFirstName(e.target.value) }
  const handleMiddleName = (e) => { setMiddleName(e.target.value) }
  const handleLastName = (e) => { setLastName(e.target.value) }
  const handleBirthFirstName = (e) => { setBirthFirstName(e.target.value) }
  const handleBirthMiddleName = (e) => { setBirthMiddleName(e.target.value) }
  const handleBirthLastName = (e) => { setBirthLastName(e.target.value) }
  const handleOtherFirstName1 = (e) => { setOtherFirstName1(e.target.value) }
  const handleOtherMiddleName1 = (e) => { setOtherMiddleName1(e.target.value) }
  const handleOtherLastName1 = (e) => { setOtherLastName1(e.target.value) }
  const handleOtherFirstName2 = (e) => { setOtherFirstName2(e.target.value) }
  const handleOtherMiddleName2 = (e) => { setOtherMiddleName2(e.target.value) }
  const handleOtherLastName2 = (e) => { setOtherLastName2(e.target.value) }
  const handleHairColor = (e) => { setHairColor(e.target.value) }
  const handleRace = (e) => { setRace(e.target.value) }
  const handleFaxInput = (e) => { setFaxValue(e.target.value) }
  const handlePhoneValue = (e) => { 
    setPhoneValue(e.target.value)
    if (isFaxSameAsPhone) {
      setFaxValue(phoneValue)
    } 
  }
  const handleIsFaxSameAsPhone = (e) => { setIsFaxSameAsPhone(e.target.checked), setFaxValue(phoneValue), setFaxInputDisabled(!isFaxSameAsPhone) /* Flip "current", not "next" */ }
  const handleIsSameAsBirthName = (e) => { setIsSameAsBirthName(e.target.checked), $("#birthName").toggleClass("d-none") }
  const handleHaveOtherNames = (e) => { setHaveOtherNames(e.target.checked), $("#otherNames").toggleClass("d-none") }
  const handleIsForWorkNumberChecked = (e) => { setIsForWorkNumberChecked(e.target.checked), $("#inputWorkPhoneNumber").parent().toggleClass("d-none") }
  const handleIsForPrivateNumberChecked = (e) => { setIsForPrivateNumberChecked(e.target.checked), $("#inputPrivatePhoneNumber").parent().toggleClass("d-none") }
  const handleAddEmployerOrSchool = (e) => { e.preventDefault(), selectNextEmployerOrSchool(e).toggleClass("d-none"), $(e.currentTarget).parent().toggleClass("d-none"), selectCurrentEmployerOrSchoolRemoveButton(e).parent().toggleClass("col-6 col-12"), scrollToNextEmployerOrSchool(e) }
  const handleRemoveEmployerOrSchool = (e) => { e.preventDefault(), $(e.currentTarget).parent().parent().toggleClass("d-none"), selectPreviousEmployerOrSchoolAddButton(e).parent().toggleClass("d-none"), selectPreviousEmployerOrSchoolRemoveButton(e).parent().toggleClass("col-6 col-12"), scrollToPrevEmployerOrSchool(e)}

  return (
    <div className={className}>
      <div className="card-body">
        <div className="row">
          <div className="col-12">
            <NameFields label="Name" firstNameId="firstName" middleNameId="middleName" lastNameId="lastName" handleFirstName={handleFirstName} handleMiddleName={handleMiddleName} handleLastName={handleLastName} firstName={firstName} middleName={middleName} lastName={lastName}>
              <CheckboxItem className="col-6" id="checkBirthname" onChange={handleIsSameAsBirthName} checked={isSameAsBirthName} label="I have different birth name" />
              <CheckboxItem className="col-6" id="checkOtherNames" onChange={handleHaveOtherNames} checked={haveOtherNames} label="I have other names" />
            </NameFields>
          </div>
          <div className="col-12 d-none" id="birthName">
            <NameFields label="Birth Name" firstNameId="birthFirstName" middleNameId="birthMiddleName" lastNameId="birthLastName" handleFirstName={handleBirthFirstName} handleMiddleName={handleBirthMiddleName} handleLastName={handleBirthLastName} firstName={birthFirstName} middleName={birthMiddleName} lastName={birthLastName} />
          </div>
          <div className="col-12 d-none" id="otherNames">
            <NameFields label="Other First Name 1" firstNameId="otherFirstName1" middleNameId="otherMiddleName1" lastNameId="otherLastName1" handleFirstName={handleOtherFirstName1} handleMiddleName={handleOtherMiddleName1} handleLastName={handleOtherLastName1} firstName={otherFirstName1} middleName={otherMiddleName1} lastName={otherLastName1} />
            <NameFields label="Other First Name 2" firstNameId="otherFirstName2" middleNameId="otherMiddleName2" lastNameId="otherLastName2" handleFirstName={handleOtherFirstName2} handleMiddleName={handleOtherMiddleName2} handleLastName={handleOtherLastName2} firstName={otherFirstName2} middleName={otherMiddleName2} lastName={otherLastName2} />
          </div>
        </div>
        <div className="form-group">
          <label className="" htmlFor="inputBirthday">Date of Birth</label>
          <div className="row">
            <div className="col-4">
              <input className="form-control" type="date" id="inputBirthday" name="date_of_birth" />
            </div>

          </div>
          {/* <Datepicker 
            id="inputBirthday"
            // value={birthday}
            placeholderText="MM/DD/YYYY"
            // isClearable="true"
            selected={selectedBirthdayDate}
            onChange={handleSelectedBirthdayDate} 
            maxDate={ legalAgeDate }
            minDate={ maxAgeDate }
            showYearDropdown
            dateFormatCalendar="MMMM"
            yearDropdownItemNumber={82} // +18 = 100 years old max
            // scrollableYearDropdown   
            dropdownMode="select"     
          /> */}
        </div>
        <div>
        <div className="form-group">
          <label>Gender</label>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="gender" value="male" id="male"/>
            <label htmlFor="male" className="form-check-label">Male</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="gender" value="female" id="female"/>
            <label htmlFor="female" className="form-check-label">Female</label>
          </div>
        </div>
        <div className="form-group">
          <label>Country</label>
          <div className="row">
            <div className="col-6 mb-3">
              <Select name="country_of_birth" options={countryNames} isClearable={true} placeholder="Country of Birth" />
            </div>
            <div className="col-6 mb-3">
              <Select name="country_of_nationality" options={countryNames} isClearable={true} placeholder="Nationality" />
            </div>
            <div className="col-6">
              <Select name="citizenship_country" options={countryNames} isClearable={true} placeholder="Citizenship" />
            </div>
          </div>
        </div>
        </div>
        <div className="row">
          <PhoneNumber id="mobilePhoneNumber" onChange={handlePhoneValue} value={phoneValue} label="Phone Number">
            <div className="row">
              <CheckboxItem className="col-6" id="isForWorkNumber" label="For Work" checked={isForWorkNumberChecked} onChange={handleIsForWorkNumberChecked} />
              <CheckboxItem className="col-6" id="isForPrivateNumber" label="For Private" checked={isForPrivateNumberChecked} onChange={handleIsForPrivateNumberChecked} />
            </div>
          </PhoneNumber>
          <PhoneNumber id="faxNumber" name="fax_number" value={faxValue} disabled={faxInputDisabled} onChange={handleFaxInput} label="Fax Number">
            <CheckboxItem className="" id="checkFaxNumberSameAsPhone" onChange={handleIsFaxSameAsPhone} checked={isFaxSameAsPhone} label="Same As Phone" />
          </PhoneNumber>
          <PhoneNumber className="d-none" id="workPhoneNumber" value={faxValue} label="Work Phone Number" />
          <PhoneNumber id="eveningPhoneNumber" value={faxValue} label="Private Phone Number" />
        </div>
        <div className="row">
          <div className="col-4">
            <div className="form-group" onChange={handleRace}>
              <label>Ethnicity</label>
              {
                [
                  { id: "race_white", text: "White" },
                  { id: "race_asian", text: "Asian" },
                  { id: "race_black", text: "Black" },
                  { id: "race_american_indian", text: "American Indian" },
                  { id: "race_native_hawaiian", text: "Native Hawaiian" }
                ].map((et) => (
                  <div className="form-check" key={et.id}>
                    <input className="form-check-input" type="radio" name="ethnicity" value={et.text.toLocaleLowerCase()} id={et.id}/>
                    <label htmlFor={et.id} className="form-check-label">{et.text}</label>
                    <input type="hidden" name={et.id} value={race === et.id ? true : false} />
                  </div>
                ))
              }
            </div>
          </div>
          <div className="col-4">
            <div className="form-group" onChange={handleHairColor}>
              <label>Hair</label>
              {
                [
                  { id: "hair_black", text: "Black" },
                  { id: "hair_brown", text: "Brown" },
                  { id: "hair_blond", text: "Blond" },
                  { id: "hair_white_or_gray", text: "White/Gray" },
                  { id: "hair_red", text: "Red" }
                ].map((et) => (
                  <div className="form-check" key={et.id}>
                    <input className="form-check-input" type="radio" name="hair_color" value={et.text.toLocaleLowerCase()} id={et.id}/>
                    <label htmlFor={et.id} className="form-check-label">{et.text}</label>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="col-4">
            <div className="form-group">
              <label>Eye</label>
              {
                [
                  { id: "eye_amber", text: "Amber (copper, gold or very light brown)" },
                  { id: "eye_blue", text: "Blue" },
                  { id: "eye_gray", text: "Gray" },
                  { id: "eye_brown", text: "Brown" },
                  { id: "eye_green", text: "Green" },
                  { id: "eye_hazel", text: "Hazel" }
                ].map((et) => (
                  <div className="form-check" key={et.id}>
                    <input className="form-check-input" type="radio" name="eye_color" value={et.text.toLocaleLowerCase()} id={et.id}/>
                    <label htmlFor={et.id} className="form-check-label">{et.text}</label>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="form-group">
          <EmployerOrSchool label="Employer/School" number={1} className="">
            <div className="col-12 pb-3">
              <button onClick={handleAddEmployerOrSchool} className="btn btn-outline-success form-control add_employer_or_school_button_1">Add Employer/School</button>
            </div>
          </EmployerOrSchool>
          <EmployerOrSchool label="Employer/School 2" number={2} className="d-none">
            <div className="col-6 pb-3">
              <button onClick={handleAddEmployerOrSchool} className="btn btn-outline-success form-control add_employer_or_school_button_2">Add More</button>
            </div>
            <div className="col-6 pb-3">
              <button onClick={handleRemoveEmployerOrSchool} className="btn btn-outline-danger form-control remove_employer_or_school_button_2">Remove</button>
            </div>
          </EmployerOrSchool>
          <EmployerOrSchool label="Employer/School 3" number={3} className="d-none">
            <div className="col-12 pb-3">
              <button onClick={handleRemoveEmployerOrSchool} className="btn btn-outline-danger form-control remove_employer_or_school_button_3">Remove</button>
            </div>
          </EmployerOrSchool>
        </div>
      </div>
    </div>
  )
}

const SpouseBiodata = ({ className }) => {
    
  useEffect(() => {

    // Names of Countries
    axios.get("https://restcountries.com/v3.1/all")
      .then(function (response) {
        // handle success
        const countryNames = response.data.map(c => c.name.common).sort()
        setCountryNames(countryNames.map(c => ({ value: c.toLowerCase(), label: c })))
        // console.log(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  })

  const now = new Date()
  const legalAgeDate = new Date(now.getFullYear()-18, now.getMonth(), now.getDate())
  const maxAgeDate = new Date(now.getFullYear()-100, now.getMonth(), now.getDate())

  const [currentSpouseFirstName, setCurrentSpouseFirstName] = useState("")
  const [currentSpouseMiddleName, setCurrentSpouseMiddleName] = useState("")
  const [currentSpouseLastName, setCurrentSpouseLastName] = useState("")
  const [currentSpousePreviousFirstName, setCurrentSpousePreviousFirstName] = useState("")
  const [currentSpousePreviousMiddleName, setCurrentSpousePreviousMiddleName] = useState("")
  const [currentSpousePreviousLastName, setCurrentSpousePreviousLastName] = useState("")
  const [currentSpouseOtherFirstName, setCurrentSpouseOtherFirstName] = useState("")
  const [currentSpouseOtherMiddleName, setCurrentSpouseOtherMiddleName] = useState("")
  const [currentSpouseOtherLastName, setCurrentSpouseOtherLastName] = useState("")
  const [currentSpousePriorSpouseFirstName, setCurrentSpousePriorSpouseFirstName] = useState("")
  const [currentSpousePriorSpouseMiddleName, setCurrentSpousePriorSpouseMiddleName] = useState("")
  const [currentSpousePriorSpouseLastName, setCurrentSpousePriorSpouseLastName] = useState("")
  const [priorSpouseFirstName, setPriorSpouseFirstName] = useState("")
  const [priorSpouseMiddleName, setPriorSpouseMiddleName] = useState("")
  const [priorSpouseLastName, setPriorSpouseLastName] = useState("")
  const [currentSpouseMarriageAddressState, setCurrentSpouseMarriageAddressState] = useState("")

  const [currentSpouseAddressState, setCurrentSpouseAddressState] = useState("")
  const [currentSpouseAddressZipCode, setCurrentSpouseAddressZipCode] = useState("")
  const [selectedBirthdayDate, setSelectedBirthdayDate] = useState(legalAgeDate)
  const [countryNames, setCountryNames] = useState([])
  const [faxValue, setFaxValue] = useState("")
  const [phoneValue, setPhoneValue] = useState("")
  const [isFaxSameAsPhone, setIsFaxSameAsPhone] = useState(false)
  const [isSameAsBirthName, setIsSameAsBirthName] = useState(false)
  const [haveOtherNames, setHaveOtherNames] = useState(false)
  const [faxInputDisabled, setFaxInputDisabled] = useState(false)
  const [isForWorkNumberChecked, setIsForWorkNumberChecked] = useState(true)
  const [isForPrivateNumberChecked, setIsForPrivateNumberChecked] = useState(false)
  const [employerOrSchoolNumberAdded, setEmployerOrSchoolNumberAdded] = useState(1)
  const [maritalStatus, setMaritalStatus] = useState("married")
  const [isCurrentSpouseCitizenOfUS, setIsCurrentSpouseCitizenOfUS] = useState(true)
  const [isCurrentSpouseCitizenOfUSSinceBirth, setIsCurrentSpouseCitizenOfUSSinceBirth] = useState(false)
  const [isCurrentSpouseCitizenSinceBirth, setIsCurrentSpouseCitizenSinceBirth] = useState(false)
  const [isCurrentSpouseLPR, setIsCurrentSpouseLPR] = useState(true)
  const [currentSpouseTimesMarried, setCurrentSpouseTimesMarried] = useState(1)
  const [isCurrentSpousePriorSpouseCitizenOfUS, setIsCurrentSpousePriorSpouseCitizenOfUS] = useState(true)
  const [isCurrentSpousePriorSpouseCitizenOfUSSinceBirth, setIsCurrentSpousePriorSpouseCitizenOfUSSinceBirth] = useState(false)
  const [isCurrentSpousePriorSpouseCitizenSinceBirth, setIsCurrentSpousePriorSpouseCitizenSinceBirth] = useState(false)
  const [isCurrentSpousePriorSpouseLPR, setIsCurrentSpousePriorSpouseLPR] = useState(true)
  const [currentSpousePriorMarriageEndBy, setCurrentSpousePriorMarriageEndBy] = useState("divorced")
  const [timesMarried, setTimesMarried] = useState(1)
  const [isPriorSpouseCitizenOfUS, setIsPriorSpouseCitizenOfUS] = useState(true)
  const [isPriorSpouseCitizenOfUSSinceBirth, setIsPriorSpouseCitizenOfUSSinceBirth] = useState(false)
  const [isPriorSpouseCitizenSinceBirth, setIsPriorSpouseCitizenSinceBirth] = useState(false)
  const [isPriorSpouseLPR, setIsPriorSpouseLPR] = useState(true)
  const [priorMarriageEndBy, setPriorMarriageEndBy] = useState("divorced")
  const [priorSpouseAnnuled, setPriorSpouseAnnuled] = useState(false)
  const [priorSpouseDivorced, setPriorSpouseDivorced] = useState(false)
  const [priorSpouseDeceased, setPriorSpouseDeceased] = useState(false)
  const [priorSpouseMarriageEndOther, setPriorSpouseMarriageEndOther] = useState(false)

  
  const handleCurrentSpouseFirstName = (e) => { setCurrentSpouseFirstName(e.target.value) }
  const handleCurrentSpouseMiddleName = (e) => { setCurrentSpouseMiddleName(e.target.value) }
  const handleCurrentSpouseLastName = (e) => { setCurrentSpouseLastName(e.target.value) }
  const handleCurrentSpousePreviousFirstName = (e) => { setCurrentSpousePreviousFirstName(e.target.value) }
  const handleCurrentSpousePreviousMiddleName = (e) => { setCurrentSpousePreviousMiddleName(e.target.value) }
  const handleCurrentSpousePreviousLastName = (e) => { setCurrentSpousePreviousLastName(e.target.value) }
  const handleCurrentSpouseOtherFirstName = (e) => { setCurrentSpouseOtherFirstName(e.target.value) }
  const handleCurrentSpouseOtherMiddleName = (e) => { setCurrentSpouseOtherMiddleName(e.target.value) }
  const handleCurrentSpouseOtherLastName = (e) => { setCurrentSpouseOtherLastName(e.target.value) }
  const handleCurrentSpousePriorSpouseFirstName = (e) => { setCurrentSpousePriorSpouseFirstName(e.target.value) }
  const handleCurrentSpousePriorSpouseMiddleName = (e) => { setCurrentSpousePriorSpouseMiddleName(e.target.value) }
  const handleCurrentSpousePriorSpouseLastName = (e) => { setCurrentSpousePriorSpouseLastName(e.target.value) }
  const handleCurrentSpouseAddressState = (e) => { setCurrentSpouseAddressState(e.target.value) }
  const handleCurrentSpouseAddressZipCode = (e) => { setCurrentSpouseAddressZipCode(e.target.value) }
  const handlePriorSpouseFirstName = (e) => { setPriorSpouseFirstName(e.target.value) }
  const handlePriorSpouseMiddleName = (e) => { setPriorSpouseMiddleName(e.target.value) }
  const handlePriorSpouseLastName = (e) => { setPriorSpouseLastName(e.target.value) }
  const handleCurrentSpouseMarriageAddressState = (e) => { setCurrentSpouseMarriageAddressState(e.target.value) }
  const handlePriorSpouseAnnuled = (e) => { setPriorSpouseAnnuled(e.target.value) }
  const handlePriorSpouseDivorced = (e) => { setPriorSpouseDivorced(e.target.value) }
  const handlePriorSpouseDeceased = (e) => { setPriorSpouseDeceased(e.target.value) }
  const handlePriorSpouseMarriageEndOther = (e) => { setPriorSpouseMarriageEndOther(e.target.value) }
  const handlePriorSpouseOther = (e) => { setPriorSpouseOther(e.target.value) }
  const handleSelectedBirthdayDate = () => { setSelectedBirthdayDate(selectedBirthdayDate) }
  const handleFaxInput = (e) => { setFaxValue(e.target.value) }
  const handlePhoneValue = (e) => { 
    setPhoneValue(e.target.value)
    if (isFaxSameAsPhone) {
      setFaxValue(phoneValue)
    } 
  }
  const handleIsFaxSameAsPhone = (e) => { setIsFaxSameAsPhone(e.target.checked), setFaxValue(phoneValue), setFaxInputDisabled(!isFaxSameAsPhone) /* Flip "current", not "next" */ }
  const handleIsSameAsBirthName = (e) => { setIsSameAsBirthName(e.target.checked), $("#birthName").toggleClass("d-none") }
  const handleHaveOtherNames = (e) => { setHaveOtherNames(e.target.checked), $("#otherNames").toggleClass("d-none") }
  const handleIsForWorkNumberChecked = (e) => { setIsForWorkNumberChecked(e.target.checked), $("#inputWorkPhoneNumber").parent().toggleClass("d-none") }
  const handleIsForPrivateNumberChecked = (e) => { setIsForPrivateNumberChecked(e.target.checked), $("#inputPrivatePhoneNumber").parent().toggleClass("d-none") }
  const handleAddEmployerOrSchool = (e) => { e.preventDefault(), selectNextEmployerOrSchool(e).toggleClass("d-none"), $(e.currentTarget).parent().toggleClass("d-none"), selectCurrentEmployerOrSchoolRemoveButton(e).parent().toggleClass("col-6 col-12"), scrollToNextEmployerOrSchool(e) }
  const handleRemoveEmployerOrSchool = (e) => { e.preventDefault(), $(e.currentTarget).parent().parent().toggleClass("d-none"), selectPreviousEmployerOrSchoolAddButton(e).parent().toggleClass("d-none"), selectPreviousEmployerOrSchoolRemoveButton(e).parent().toggleClass("col-6 col-12"), scrollToPrevEmployerOrSchool(e)}
  const handleMaritalStatus = (e) => { 
    setMaritalStatus(e.target.value) 
    if (e.target.value === "single") {
      $('#spouseField').find('*').attr('disabled', true)
    } else {
      $('#spouseField').find('*').attr('disabled', false)
    }
  }
  const handleCurrentSpouseHasNoPrevName = () => { $("#currentSpousePrevName").toggleClass("d-none") }
  const handleCurrentSpouseHasAnotherName = () => { $("#currentSpouseAnotherName").toggleClass("d-none") }
  const handleIsCurrentSpouseCitizenOfUS = (e) => { setIsCurrentSpouseCitizenOfUS(e.target.value === "true" ? true : false) }
  const handleIsCurrentSpouseCitizenOfUSSinceBirth = (e) => { setIsCurrentSpouseCitizenOfUSSinceBirth(e.target.checked) }
  const handleIsCurrentSpouseCitizenSinceBirth = (e) => { setIsCurrentSpouseCitizenSinceBirth(e.target.checked) }
  const handleIsCurrentSpouseLPR = (e) => { setIsCurrentSpouseLPR(e.target.value === "true" ? true : false) }
  const handleCurrentSpouseTimesMarried = (e) => { setCurrentSpouseTimesMarried(e.target.value) }

  const handleIsCurrentSpousePriorSpouseCitizenOfUS = (e) => { setIsCurrentSpousePriorSpouseCitizenOfUS(e.target.value === "true" ? true : false) }
  const handleIsCurrentSpousePriorSpouseCitizenOfUSSinceBirth = (e) => { setIsCurrentSpousePriorSpouseCitizenOfUSSinceBirth(e.target.checked) }
  const handleIsCurrentSpousePriorSpouseCitizenSinceBirth = (e) => { setIsCurrentSpousePriorSpouseCitizenSinceBirth(e.target.checked) }
  const handleIsCurrentSpousePriorSpouseLPR = (e) => { setIsCurrentSpousePriorSpouseLPR(e.target.value === "true" ? true : false) }
  const handleCurrentSpousePriorMarriageEndBy = (e) => { setCurrentSpousePriorMarriageEndBy(e.target.value) }
  const handleTimesMarried = (e) => { setTimesMarried(e.target.value) }

  const handleIsPriorSpouseCitizenOfUS = (e) => { setIsPriorSpouseCitizenOfUS(e.target.value === "true" ? true : false) }
  const handleIsPriorSpouseCitizenOfUSSinceBirth = (e) => { setIsPriorSpouseCitizenOfUSSinceBirth(e.target.checked) }
  const handleIsPriorSpouseCitizenSinceBirth = (e) => { setIsPriorSpouseCitizenSinceBirth(e.target.checked) }
  const handleIsPriorSpouseLPR = (e) => { setIsPriorSpouseLPR(e.target.value === "true" ? true : false) }
  const handlePriorMarriageEndBy = (e) => { setCurrentSpousePriorMarriageEndBy(e.target.value) }

  return (
    <div className={className} id="maritalStatusField">
      <div className="card-body">
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label>Marital Status</label>
              <div className="d-flex" onChange={handleMaritalStatus}>
                <div className="form-check mr-3">
                  <input className="form-check-input" type="radio" name="marital_status" value="single" id="single" checked={maritalStatus === "single"} />
                  <label htmlFor="single" className="form-check-label">Single</label>
                </div>
                <div className="form-check mr-3">
                  <input className="form-check-input" type="radio" name="marital_status" value="married" id="married"/>
                  <label htmlFor="married" className="form-check-label">Married</label>
                </div>
                <div className="form-check mr-3">
                  <input className="form-check-input" type="radio" name="marital_status" value="divorced" id="divorced"/>
                  <label htmlFor="divorced" className="form-check-label">Divorced</label>
                </div>
                <div className="form-check mr-3">
                  <input className="form-check-input" type="radio" name="marital_status" value="widowed" id="widowed"/>
                  <label htmlFor="widowed" className="form-check-label">Widowed</label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12" id="spouseField">
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <div className="row">
                    <div className="col-2" onChange={handleTimesMarried}>
                      <input type="number" name="times_married" className="form-control" defaultValue={maritalStatus === "single" ? 0 : 1} />
                    </div>
                    <div className="col-10 pt-2">
                      <span>time(s) married</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
               <NameFields label="Current Spouse&apos;s Name" firstNameId="currentSpouseFirstName" middleNameId="currentSpouseMiddleName" lastNameId="currentSpouseLastName" handleFirstName={handleCurrentSpouseFirstName} handleMiddleName={handleCurrentSpouseMiddleName} handleLastName={handleCurrentSpouseLastName} firstName={currentSpouseFirstName} middleName={currentSpouseMiddleName} lastName={currentSpouseLastName}>
                  <CheckboxItem className="col-6" id="currentSpouseHasNoPrevName" label="He/she has NO prior name" onChange={handleCurrentSpouseHasNoPrevName} />
                  <CheckboxItem className="col-6" id="currentSpouseHasAnotherName" label="He/she has another name" onChange={handleCurrentSpouseHasAnotherName} />
                </NameFields>
              </div>
              <div className="col-12" id="currentSpousePrevName">
                <NameFields label="Current Spouse&apos;s Previous Name" firstNameId="currentSpousePreviousFirstName" middleNameId="currentSpousePreviousMiddleName" lastNameId="currentSpousePreviousLastName" handleFirstName={handleCurrentSpousePreviousFirstName} handleMiddleName={handleCurrentSpousePreviousMiddleName} handleLastName={handleCurrentSpousePreviousLastName} firstName={currentSpousePreviousFirstName} middleName={currentSpousePreviousMiddleName} lastName={currentSpousePreviousLastName} />
              </div>
              <div className="col-12 d-none" id="currentSpouseAnotherName">
              <NameFields label="Current Spouse&apos;s Other Name" firstNameId="currentSpouseOtherFirstName" middleNameId="currentSpouseOtherMiddleName" lastNameId="currentSpouseOtherLastName" handleFirstName={handleCurrentSpouseOtherFirstName} handleMiddleName={handleCurrentSpouseOtherMiddleName} handleLastName={handleCurrentSpouseOtherLastName} firstName={currentSpouseOtherFirstName} middleName={currentSpouseOtherMiddleName} lastName={currentSpouseOtherLastName} />
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-6">
                  <label className="" htmlFor="inputCurrentSpouseBirthday">Current Spouse&apos;s Date of Birth</label>
                  <input className="form-control" type="date" id="inputCurrentSpouseBirthday" name="current_spouse_date_of_birth" />
                </div>
                <div className="col-6">
                  <label className="" htmlFor="inputCurrentSpouseMarriageDate">Married Since</label>
                  <input className="form-control" type="date" id="inputCurrentSpouseMarriageDate" name="current_spouse_marriage_date" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row" id="">
                <div className="col-12">
                  <label htmlFor="">Current Spouse&apos;s Address</label>
                </div>
                <div className="col-12 pb-3">
                  <input type="street" className="form-control" placeholder="Street Address" name="current_spouse_address_street" />
                </div>
                <div className="col-2 pb-3">
                  <input type="street" className="form-control" placeholder="Ext." name="current_spouse_address_extra" />
                </div>
                <div className="col-2 pb-3">
                  <input type="address_number" className="form-control" placeholder="No." name="current_spouse_address_number" />
                </div>
                <div className="col-4 pb-3">
                  <input type="city" className="form-control" placeholder="City" name="current_spouse_address_city" />
                </div>
                <div className="col-4 pb-3">
                  <input type="state" className="form-control" placeholder="State/province" name="current_spouse_address_state" onChange={handleCurrentSpouseAddressState} />
                  <input type="hidden" className="form-control" name="current_spouse_address_province" value={currentSpouseAddressState} />
                </div>
                <div className="col-4">
                  <input type="zip" className="form-control" placeholder="Zip" name="current_spouse_address_zip_code" onChange={handleCurrentSpouseAddressZipCode} />
                  <input type="hidden" className="form-control" name="current_spouse_address_postal_code" value={currentSpouseAddressZipCode} />
                </div>
                <div className="col-8">
                  <input type="country" className="form-control" placeholder="Country" name="current_spouse_address_country" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Current Spouse&apos;s Employer</label>
              <input className="form-control" type="name" placeholder="Employer Name" name="current_spouse_employer" />
            </div>
            <div>
              <label>Is current spouse a citizen of United States?</label>
              <div className="row">
                <div className="col-6 form-group" id="isCurrentSpouseCitizenOfUS" onChange={handleIsCurrentSpouseCitizenOfUS}>
                  <div className="form-check">
                    <input id="currentSpouseCitizenIsUS" className="form-check-input" type="radio" name="current_spouse_citizen" value={true} />
                    <label className="form-check-label" htmlFor="currentSpouseCitizenIsUS">Yes</label>
                  </div>
                  <div className="form-check">
                    <input id="currentSpouseCitizenIsNotUS" className="form-check-input" type="radio" name="current_spouse_citizen" value={false} />
                    <label className="form-check-label" htmlFor="currentSpouseCitizenIsNotUS">No</label>
                  </div>
                </div>
                <div id="currentSpouseUSCitizenSinceBirth" className={`col-6 mb-3 form-group form-check ${!isCurrentSpouseCitizenOfUS ? "d-none" : ""}`}>
                  <CheckboxItem className="" id="isCurrentSpouseUSCitizenSinceBirth" label="Since birth" checked={isCurrentSpouseCitizenOfUSSinceBirth} onChange={handleIsCurrentSpouseCitizenOfUSSinceBirth} />
                </div>
                <div className="col-12">
                  <div id="currentSpouseCountryOfCitizenship" className={`form-group ${isCurrentSpouseCitizenOfUS ? "d-none" : ""}`}>
                    <Select name="current_spouse_country_of_citizenship" options={countryNames} isClearable={true} placeholder="Current Spouse&apos;s Country of Citizenship" />
                    <CheckboxItem className="" id="isCurrentSpouseCitizenSinceBirth" label="Since birth" checked={isCurrentSpouseCitizenSinceBirth} onChange={handleIsCurrentSpouseCitizenSinceBirth} />
                  </div>
                </div>
              </div>
            </div>
            <div className={`form-group ${!(isCurrentSpouseCitizenOfUS && !isCurrentSpouseCitizenOfUSSinceBirth) ? "d-none" : ""}`}>
              <div className="row">
                <div className="col-12">
                  <label>Current Spouse&apos;s Date Became Citizen of US</label>
                </div>
                <div className="col-4">
                  <input className="form-control" type="date" name="current_spouse_date_became_citizen" />
                </div>
              </div>
            </div>
            <div className={`${isCurrentSpouseCitizenOfUS ? "d-none" : ""}`}>
              <div className={`form-group ${isCurrentSpouseCitizenSinceBirth ? "d-none" : ""}`}>
                <div className="row">
                  <div className="col-12">
                    <label>Date Became Citizen</label>
                  </div>
                  <div className="col-4">
                    <input className="form-control" type="date" name="current_spouse_citizen_at_birth" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Current Spouse&apos;s A-Number (Alien Registration Number)</label>
                <div className="row">
                  <div className="input-group col-6">
                    <div className="input-group-prepend"><span className="input-group-text">A0</span></div>
                    <input className="form-control" type="a-number" placeholder="e.g. 12345678" name="current_spouse_a_number" />
                  </div>
                </div>
              </div>
              <div className="form-group" onChange={handleIsCurrentSpouseLPR}>
                <label>Is current spouse a Lawful Permanent Resident of US?</label>
                <div className="form-check">
                  <input id="currentSpouseIsLPR" className="form-check-input" type="radio" name="current_spouse_lawful_permanent_resident" value={true} />
                  <label htmlFor="currentSpouseIsLPR" className="form-check-label">Yes</label>
                </div>
                <div className="form-check">
                  <input id="currentSpouseIsNotLPR" className="form-check-input" type="radio" name="current_spouse_lawful_permanent_resident" value={false} />
                  <label id="currentSpouseIsNotLPR" className="form-check-label">No</label>
                </div>
              </div>
              <div className={`form-group ${isCurrentSpouseLPR ? "d-none" : ""}`}>
                <label htmlFor="currentSpouseImmigrationStatus">Current Spouse&apos;s Immigration Status</label>
                <div className="row">
                  <div className="col-6">
                    <input id="currentSpouseImmigrationStatus" className="form-control" type="text" name="current_spouse_immigration_status_other" placeholder="e.g. Non-Immigrants" />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Current Spouse&apos;s Marriage Location</label>
                <div className="row">
                  <div className="col-4 pb-3">
                    <input type="city" className="form-control" placeholder="City" name="current_spouse_marriage_address_city" />
                  </div>
                  <div className="col-4 pb-3">
                    <input type="state" className="form-control" placeholder="State/province" name="current_spouse_marriage_address_state" onChange={handleCurrentSpouseMarriageAddressState} />
                    <input type="hidden" name="current_spouse_marriage_address_province" value={currentSpouseMarriageAddressState} />
                  </div>
                  <div className="col-8">
                    <input type="country" className="form-control" placeholder="Country" />
                  </div>
                </div>
            </div>
            <div className="form-group">
              <label htmlFor="currentSpouseTimesMarried">How many times has current spouse been married? (including current partner)</label>
              <div className="row">
                <div className="col-2">
                  <input id="currentSpouseTimesMarried" className="form-control" type="number" name="current_spouse_times_married" defaultValue={1} value={currentSpouseTimesMarried} onChange={handleCurrentSpouseTimesMarried} />
                </div>
              </div>
            </div>
            <div className={currentSpouseTimesMarried > 1 ? "" : "d-none"}>
              <NameFields label="Current Spouse&apos;s Previous Spouse&apos;s Name" firstNameId="currentSpousePriorSpouseFirstName" middleNameId="currentSpousePriorSpouseMiddleName" lastNameId="currentSpousePriorSpouseLastName" handleFirstName={handleCurrentSpousePriorSpouseFirstName} handleMiddleName={handleCurrentSpousePriorSpouseMiddleName} handleLastName={handleCurrentSpousePriorSpouseLastName} firstName={currentSpousePriorSpouseFirstName} middleName={currentSpousePriorSpouseMiddleName} lastName={currentSpousePriorSpouseLastName} />
              <div>
                <label>Is current spouse&apos;s prior spouse a citizen of United States?</label>
                <div className="row">
                  <div className="col-6 form-group" id="isCurrentSpousePriorSpouseCitizenOfUS" onChange={handleIsCurrentSpousePriorSpouseCitizenOfUS}>
                    <div className="form-check">
                      <input id="currentSpousePriorSpouseCitizenIsUS" className="form-check-input" type="radio" name="current_spouse_prior_spouse_citizen" value={true} />
                      <label className="form-check-label" htmlFor="currentSpousePriorSpouseCitizenIsUS">Yes</label>
                    </div>
                    <div className="form-check">
                      <input id="currentSpousePriorSpouseCitizenIsNotUS" className="form-check-input" type="radio" name="current_spouse_prior_spouse_citizen" value={false} />
                      <label className="form-check-label" htmlFor="currentSpousePriorSpouseCitizenIsNotUS">No</label>
                    </div>
                  </div>
                  <div id="currentSpousePriorSpouseUSCitizenSinceBirth" className={`col-6 mb-3 form-group form-check ${!isCurrentSpousePriorSpouseCitizenOfUS ? "d-none" : ""}`}>
                    <CheckboxItem className="" id="isCurrentSpousePriorSpouseUSCitizenSinceBirth" label="Since birth" checked={isCurrentSpousePriorSpouseCitizenOfUSSinceBirth} onChange={handleIsCurrentSpousePriorSpouseCitizenOfUSSinceBirth} />
                  </div>
                  <div className="col-12">
                    <div id="currentSpousePriorSpouseCountryOfCitizenship" className={`form-group ${isCurrentSpousePriorSpouseCitizenOfUS ? "d-none" : ""}`}>
                      <Select name="current_spouse_prior_spouse_country_of_citizenship" options={countryNames} isClearable={true} placeholder="Current Spouse&apos;s Country of Citizenship" />
                      <CheckboxItem className="" id="isCurrentSpousePriorSpouseCitizenSinceBirth" label="Since birth" checked={isCurrentSpousePriorSpouseCitizenSinceBirth} onChange={handleIsCurrentSpousePriorSpouseCitizenSinceBirth} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`form-group ${!(isCurrentSpousePriorSpouseCitizenOfUS && !isCurrentSpousePriorSpouseCitizenOfUSSinceBirth) ? "d-none" : ""}`}>
                <div className="row">
                  <div className="col-12">
                    <label>Current Spouse&apos;s Prior Spouse&apos;s Date Became Citizen of US</label>
                  </div>
                  <div className="col-4">
                    <input className="form-control" type="date" />
                  </div>
                </div>
                <div className={`${isCurrentSpousePriorSpouseCitizenOfUS ? "d-none" : ""}`}>
                  <div className={`form-group ${isCurrentSpousePriorSpouseCitizenSinceBirth ? "d-none" : ""}`}>
                    <div className="row">
                      <div className="col-12">
                        <label>Date Became Citizen</label>
                      </div>
                      <div className="col-4">
                        <input className="form-control" type="date" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Current Spouse&apos;s Prior Spouse&apos;s A-Number (Alien Registration Number)</label>
                    <div className="row">
                      <div className="input-group col-6">
                        <div className="input-group-prepend"><span className="input-group-text">A0</span></div>
                        <input className="form-control" type="a-number" placeholder="e.g. 12345678" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group" onChange={handleIsCurrentSpousePriorSpouseLPR}>
                    <label>Is current spouse&apos;s prior spouse a Lawful Permanent Resident of US?</label>
                    <div className="form-check">
                      <input id="currentSpousePriorSpouseIsLPR" className="form-check-input" type="radio" name="current_spouse_prior_spouse_lawful_permanent_resident" value={true} />
                      <label htmlFor="currentSpousePriorSpouseIsLPR" className="form-check-label">Yes</label>
                    </div>
                    <div className="form-check">
                      <input id="currentSpousePriorSpouseIsNotLPR" className="form-check-input" type="radio" name="current_spouse_prior_spouse_lawful_permanent_resident" value={false} />
                      <label id="currentSpousePriorSpouseIsNotLPR" className="form-check-label">No</label>
                    </div>
                  </div>
                  <div className={`form-group ${isCurrentSpousePriorSpouseLPR ? "d-none" : ""}`}>
                    <label htmlFor="currentSpousePriorSpouseImmigrationStatus">Current Spouse&apos;s Immigration Status</label>
                    <div className="row">
                      <div className="col-6">
                        <input id="currentSpousePriorSpouseImmigrationStatus" className="form-control" type="text" name="current_spouse_prior_spouse_immigration_status_other" placeholder="e.g. Non-Immigrants" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="" htmlFor="inputCurrentSpousePriorSpouseBirthday">Current Spouse&apos;s Prior Spouse&apos;s Date of Birth</label>
                <div className="row">
                  <div className="col-4">
                    <input className="form-control" type="date" id="inputCurrentSpousePriorSpouseBirthday" name="current_spouse_prior_spouse_date_of_birth" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="" htmlFor="inputCurrentSpousePriorSpouseMarriageDuration">Current Spouse&apos;s Prior Marriage Duration</label>
                <div className="row">
                  <div className="col-4">
                    <input className="form-control" type="date" id="inputCurrentSpousePriorSpouseMarriageDateStart" name="current_spouse_prior_spouse_date_of_marriage" />
                  </div>
                  <div className="col-1 d-flex justify-content-center pt-2">
                    <span>to</span>
                  </div>
                  <div className="col-4">
                    <input className="form-control" type="date" id="inputCurrentSpousePriorSpouseMarriageDateEnd" name="current_spouse_prior_spouse_end_date_of_marriage" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <label>Current Spouse&apos;s Country</label>
                </div>
                <div className="col-6 mb-3">
                  <Select name="current_spouse_prior_spouse_country_of_birth" options={countryNames} isClearable={true} placeholder="Country of Birth" />
                </div>
                <div className="col-6">
                  <Select name="current_spouse_prior_spouse_country_of_citizenship" options={countryNames} isClearable={true} placeholder="Citizenship" />
                </div>
              </div>
              <div className="form-group">
                <label>Current Spouse&apos;s Prior Marriage End By</label>
                <div className="d-flex" onChange={handleCurrentSpousePriorMarriageEndBy}>
                  <div className="form-check mr-3">
                    <input id="currentSpousePriorMarriageAnnuled" type="radio" className="form-check-input" name="current_spouse_prior_spouse_marriage_end_by" value="annuled" />
                    <label htmlFor="currentSpousePriorMarriageAnnuled" className="form-check-label">Annulment</label>
                  </div>
                  <div className="form-check mr-3">
                    <input id="currentSpousePriorMarriageDivorced" type="radio" className="form-check-input" name="current_spouse_prior_spouse_marriage_end_by" value="divorced" />
                    <label htmlFor="currentSpousePriorMarriageDivorced" className="form-check-label">Divorce</label>
                  </div>
                  <div className="form-check mr-3">
                    <input id="currentSpousePriorMarriageDeceased" type="radio" className="form-check-input" name="current_spouse_prior_spouse_marriage_end_by" value="deceased" />
                    <label htmlFor="currentSpousePriorMarriageDeceased" className="form-check-label">Widowed</label>
                  </div>
                  <div className="form-check mr-3">
                    <input id="currentSpousePriorMarriageOther" type="radio" className="form-check-input" name="current_spouse_prior_spouse_marriage_end_by" value="other" />
                    <label htmlFor="currentSpousePriorMarriageOther" className="form-check-label">Other</label>
                  </div>
                  <div className={`${currentSpousePriorMarriageEndBy !== "other" ? "d-none" : ""}`}>
                    <input className="form-control" type="text" placeholder="Specify..." />
                  </div>
                </div>
              </div>
{/* ================================================ */}
            </div>
            <div className={timesMarried > 1 ? "" : "d-none"}>
              <NameFields label="Prior Spouse&apos;s Name" firstNameId="priorSpouseFirstName" middleNameId="priorSpouseMiddleName" lastNameId="priorSpouseLastName" handleFirstName={handlePriorSpouseFirstName} handleMiddleName={handlePriorSpouseMiddleName} handleLastName={handlePriorSpouseLastName} firstName={priorSpouseFirstName} middleName={priorSpouseMiddleName} lastName={priorSpouseLastName} />
              <div>
                <label>Is your prior spouse a citizen of United States?</label>
                <div className="row">
                  <div className="col-6 form-group" id="isPriorSpouseCitizenOfUS" onChange={handleIsPriorSpouseCitizenOfUS}>
                    <div className="form-check">
                      <input id="priorSpouseCitizenIsUS" className="form-check-input" type="radio" name="prior_spouse_citizen" value={true} />
                      <label className="form-check-label" htmlFor="priorSpouseCitizenIsUS">Yes</label>
                    </div>
                    <div className="form-check">
                      <input id="priorSpouseCitizenIsNotUS" className="form-check-input" type="radio" name="prior_spouse_citizen" value={false} />
                      <label className="form-check-label" htmlFor="priorSpouseCitizenIsNotUS">No</label>
                    </div>
                  </div>
                  <div id="priorSpouseUSCitizenSinceBirth" className={`col-6 mb-3 form-group form-check ${!isPriorSpouseCitizenOfUS ? "d-none" : ""}`}>
                    <CheckboxItem className="" id="isPriorSpouseUSCitizenSinceBirth" label="Since birth" checked={isPriorSpouseCitizenOfUSSinceBirth} onChange={handleIsPriorSpouseCitizenOfUSSinceBirth} />
                  </div>
                  <div className="col-12">
                    <div id="priorSpouseCountryOfCitizenship" className={`form-group ${isPriorSpouseCitizenOfUS ? "d-none" : ""}`}>
                      <Select name="prior_spouse_country_of_citizenship" options={countryNames} isClearable={true} placeholder="Country of Citizenship" />
                      <CheckboxItem className="" id="isPriorSpouseCitizenSinceBirth" label="Since birth" checked={isPriorSpouseCitizenSinceBirth} onChange={handleIsPriorSpouseCitizenSinceBirth} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`form-group ${!(isPriorSpouseCitizenOfUS && !isPriorSpouseCitizenOfUSSinceBirth) ? "d-none" : ""}`}>
                <div className="row">
                  <div className="col-12">
                    <label>Your Prior Spouse&apos;s Date Became Citizen of US</label>
                  </div>
                  <div className="col-4">
                    <input className="form-control" type="date" />
                  </div>
                </div>
                <div className={`${isPriorSpouseCitizenOfUS ? "d-none" : ""}`}>
                  <div className={`form-group ${isPriorSpouseCitizenSinceBirth ? "d-none" : ""}`}>
                    <div className="row">
                      <div className="col-12">
                        <label>Date Became Citizen</label>
                      </div>
                      <div className="col-4">
                        <input className="form-control" type="date" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Your Prior Spouse&apos;s A-Number (Alien Registration Number)</label>
                    <div className="row">
                      <div className="input-group col-6">
                        <div className="input-group-prepend"><span className="input-group-text">A0</span></div>
                        <input className="form-control" type="a-number" placeholder="e.g. 12345678" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group" onChange={handleIsPriorSpouseLPR}>
                    <label>Is Your prior spouse a Lawful Permanent Resident of US?</label>
                    <div className="form-check">
                      <input id="priorSpouseIsLPR" className="form-check-input" type="radio" name="prior_spouse_lawful_permanent_resident" value={true} />
                      <label htmlFor="priorSpouseIsLPR" className="form-check-label">Yes</label>
                    </div>
                    <div className="form-check">
                      <input id="priorSpouseIsNotLPR" className="form-check-input" type="radio" name="prior_spouse_lawful_permanent_resident" value={false} />
                      <label id="priorSpouseIsNotLPR" className="form-check-label">No</label>
                    </div>
                  </div>
                  <div className={`form-group ${isPriorSpouseLPR ? "d-none" : ""}`}>
                    <label htmlFor="priorSpouseImmigrationStatus">Immigration Status</label>
                    <div className="row">
                      <div className="col-6">
                        <input id="priorSpouseImmigrationStatus" className="form-control" type="text" name="prior_spouse_immigration_status_other" placeholder="e.g. Non-Immigrants" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="" htmlFor="inputPriorSpouseBirthday">Your Prior Spouse&apos;s Date of Birth</label>
                <div className="row">
                  <div className="col-4">
                    <input className="form-control" type="date" id="inputPriorSpouseBirthday" name="prior_spouse_date_of_birth" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="" htmlFor="inputPriorSpouseMarriageDuration">Your Prior Marriage Duration</label>
                <div className="row">
                  <div className="col-4">
                    <input className="form-control" type="date" id="inputPriorSpouseMarriageDateStart" name="prior_spouse_date_of_marriage" />
                  </div>
                  <div className="col-1 d-flex justify-content-center pt-2">
                    <span>to</span>
                  </div>
                  <div className="col-4">
                    <input className="form-control" type="date" id="inputPriorSpouseMarriageDateEnd" name="prior_spouse_end_date_of_marriage" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <label>Your Prior Spouse&apos;s Country</label>
                </div>
                <div className="col-6 mb-3">
                  <Select name="prior_spouse_country_of_birth" options={countryNames} isClearable={true} placeholder="Country of Birth" />
                </div>
                <div className="col-6">
                  <Select name="prior_spouse_country_of_citizenship" options={countryNames} isClearable={true} placeholder="Citizenship" />
                </div>
              </div>
              <div className="form-group">
                <label>Your Prior Marriage End By</label>
                <div className="d-flex" onChange={handlePriorMarriageEndBy}>
                  <div className="form-check mr-3">
                    <input id="priorMarriageAnnuled" type="radio" className="form-check-input" name="prior_spouse_marriage_end_by" value="annuled" onChange={handlePriorSpouseAnnuled} />
                    <input type="hidden" className="form-check-input" name="prior_spouse_annuled" value={priorSpouseAnnuled} />
                    <label htmlFor="priorMarriageAnnuled" className="form-check-label">Annulment</label>
                  </div>
                  <div className="form-check mr-3">
                    <input id="priorMarriageDivorced" type="radio" className="form-check-input" name="prior_spouse_marriage_end_by" value="divorced" onChange={handlePriorSpouseDivorced} />
                    <input type="hidden" className="form-check-input" name="prior_spouse_divorced" value={priorSpouseDivorced} />
                    <label htmlFor="priorMarriageDivorced" className="form-check-label">Divorce</label>
                  </div>
                  <div className="form-check mr-3">
                    <input id="priorMarriageDeceased" type="radio" className="form-check-input" name="prior_spouse_marriage_end_by" value="deceased" onChange={handlePriorSpouseDeceased} />
                    <input type="hidden" className="form-check-input" name="prior_spouse_deceased" value={priorSpouseDeceased} onChange={handlePriorSpouseDeceased} />
                    <label htmlFor="priorMarriageDeceased" className="form-check-label">Widowed</label>
                  </div>
                  <div className="form-check mr-3">
                    <input id="priorMarriageOther" type="radio" className="form-check-input" name="prior_spouse_marriage_end_by" value="other" />
                    <input type="hidden" className="form-check-input" name="" value={priorSpouseMarriageEndOther} onChange={handlePriorSpouseMarriageEndOther} />
                    <label htmlFor="priorMarriageOther" className="form-check-label">Other</label>
                  </div>
                  <div className={`${priorMarriageEndBy !== "other" ? "d-none" : ""}`}>
                    <input name="prior_spouse_marriage_end_other" className="form-control" type="text" placeholder="Specify..." />
                  </div>
                </div>
              </div>
{/* ================================================ */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="container">
      <form action="https://getform.io/f/70755d8f-1e45-4823-b520-d86dbbe6930f" method="POST">
        <div className="row">
          <div className="col-12 px-4 pt-4">
            <h3 className="">My Profile</h3>
          </div>

          <MyBiodata className="col-6" />
          <SpouseBiodata className="col-6" />

          <div className="col-12 mb-3">
            <div className="card-footer d-flex justify-content-end">
              <button type="submit" className="btn btn-primary" onClick={(e) => { 
                window.location.href = "/data" }}>Submit</button>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
