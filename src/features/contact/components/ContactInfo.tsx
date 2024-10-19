import React from "react";

const ContactInfo = () => {
  return (
    <div className="">
      <h2 className="mb-4 font-bold">Contact Information</h2>
      <p className="mb-4 text-gray-600">
        <strong>Phone:</strong> (+20) 122-168-1400
      </p>
      <p className="mb-4 text-gray-600">
        <strong>Email:</strong> contact@atsnet.org
      </p>
      <p className="mb-4 text-gray-600">
        <strong>Working Hours:</strong>
      </p>
      <p className="text-gray-600">
        Sunday - Thursday: 8:00 AM - 2:30 PM
        <br />
        Friday - Saturday: Closed
      </p>
      <br></br>
      <h2 className="mb-4 font-bold">Counselor Information</h2>
      <p className="mb-4 text-gray-600">
        <strong>Name:</strong> Zainab Zagzouq
      </p>
      <p className="mb-4 text-gray-600">
        <strong>Email:</strong> zainab.zagouq@atsnee.org
      </p>
    </div>
  );
};

export default ContactInfo;
