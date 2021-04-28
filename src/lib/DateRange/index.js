import React, { useState, useEffect } from "react";
import "react-dates/initialize";
import DateRangePicker from "react-dates/lib/components/DateRangePicker";
import isInclusivelyAfterDay from "react-dates/lib/utils/isInclusivelyAfterDay";
import "react-dates/lib/css/_datepicker.css";
import "./date_range.css";
import moment from "moment";
// import localization from "moment/locale/de";

function DateRange({ handleDate, clear }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  //   useEffect(() => {
  //     moment().locale("de", localization).format("LLL");
  //   }, []);

  useEffect(() => {
    if (startDate) {
      handleDate(startDate.format("YYYY-MM-DD"), "start");
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      handleDate(endDate.format("YYYY-MM-DD"), "end");
    }
  }, [endDate]);

  const clearBoth = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    if (clear) {
      clearBoth();
    }
  }, [clear]);

  return (
    <>
      <DateRangePicker
        small
        block
        startDate={startDate}
        startDateId="tata-start-date"
        endDate={endDate}
        startDatePlaceholderText={window.strings.Dashboard_startDate || 'Start Date'}
        endDatePlaceholderText={window.strings.Dashboard_endDate || 'End Date'}
        endDateId="tata-end-date"
        onDatesChange={handleDatesChange}
        focusedInput={focusedInput}
        onFocusChange={focusedInput => setFocusedInput(focusedInput)}
        displayFormat="YYYY-MM-DD"
        isOutsideRange={day =>
          isInclusivelyAfterDay(day, moment().add(1, "days"))
        }
        initialVisibleMonth={() => moment().subtract(1, "month")}
        showClearDates={true}
      />
    </>
  );
}

export default DateRange;
