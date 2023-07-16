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
    year: (year) => year && year <= new Date().getFullYear(),
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
  const validationDate = new Date(year, month, day);

  if (year < 1000) {
    validationDate.setFullYear(year);
  }

  return (
    validationDate.getDate() === day &&
    validationDate.getMonth() === month &&
    validationDate.getFullYear() === year
  );
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
  const isVaid = validateFields(data);

  if (!isVaid) {
    return;
  }

  const { day, month, year } = data.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: Number(value) }),
    {}
  );

  const isDateValid = validateDate(day, month - 1, year);

  if (!isDateValid) {
    form.querySelector(".error-text.all-fields").className += ` ${errorClass}`;
    return;
  }

  const calculatedAge = calculateAge(day, month - 1, year);

  document.querySelectorAll(".result").forEach((result) => {
    result.textContent = calculatedAge[result.getAttribute("data-id")];
  });
});
