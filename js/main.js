const form = document.querySelector(".date-form");
const errorClass = "error";

const removeFormErrors = () => {
  document
    .querySelectorAll(`.${errorClass}`)
    .forEach((item) => item.classList.remove(errorClass));
};

form
  .querySelectorAll("input")
  .forEach((input) => input.addEventListener("focus", removeFormErrors));

const validateFields = (fields) => {
  const validatioMap = {
    day: (day) => day > 0 && day <= 31,
    month: (month) => month > 0 && month <= 12,
    year: (year) => year !== undefined && year <= new Date().getFullYear(),
  };
  let areAllFieldsValid = true;

  fields.forEach(([field, value]) => {
    const isFieldValid = validatioMap[field](Number(value));

    if (!isFieldValid) {
      form.querySelector(`[data-id="${field}"]`).className += ` ${errorClass}`;
      areAllFieldsValid = false;
    }
  });

  return areAllFieldsValid;
};

const validateDate = (day, month, year) => {
  const date = new Date(year, month, day);
  const paragraphForErrorTxt = document.querySelector(".error-text.all-fields");

  if (year < 1000) {
    date.setFullYear(year);
  }

  const isDateInThePast = date < new Date();
  const isDateValid =
    date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year;

  if (!isDateInThePast || !isDateValid) {
    paragraphForErrorTxt.textContent = !isDateInThePast
      ? "Must be in the past"
      : "Must be correct date";
    paragraphForErrorTxt.className += ` ${errorClass}`;
    return false;
  }

  return true;
};

const calculateAge = (birthDay, birthMonth, birthYear) => {
  const date = new Date();
  const [currDay, currMonth, currYear] = [
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
  ];

  const isBdayPassedThisYear = new Date(currYear, birthMonth, birthDay) < date;
  const daysCountInBdayMonth = new Date(currYear, birthMonth + 1, 0).getDate();
  const totalDaysInPartialMonths = daysCountInBdayMonth - birthDay + currDay;

  const getMonth = () => {
    const monthsCount = isBdayPassedThisYear
      ? currMonth - birthMonth
      : 12 - (currMonth - birthMonth);

    return monthsCount - (birthDay > currDay);
  };

  return {
    year: currYear - birthYear - !isBdayPassedThisYear,
    month: getMonth(),
    day:
      totalDaysInPartialMonths >= daysCountInBdayMonth
        ? totalDaysInPartialMonths - daysCountInBdayMonth
        : totalDaysInPartialMonths,
  };
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  removeFormErrors();
  const data = [...new FormData(e.target).entries()];
  const areFieldVvalid = validateFields(data);

  if (!areFieldVvalid) {
    return;
  }

  const { day, month, year } = data.reduce(
    (acc, [fieldName, value]) => ({ ...acc, [fieldName]: Number(value) }),
    {}
  );

  const isDateValid = validateDate(day, month - 1, year);

  if (!isDateValid) {
    return;
  }

  const calculatedAge = calculateAge(day, month - 1, year);

  document.querySelectorAll(".result").forEach((result) => {
    result.textContent = calculatedAge[result.getAttribute("data-id")];
  });
});
