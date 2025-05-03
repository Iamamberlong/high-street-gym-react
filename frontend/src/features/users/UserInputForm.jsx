import React, { useState } from "react";

export default function UserInputForm({
  onSubmit,
  buttonText = "Submit",
  initialFormData = {},
}) {
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    unitNumber: "",
    streetNumber: "",
    streetName: "",
    suburb: "",
    postcode: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    unitNumber: "",
    streetNumber: "",
    streetType: "Street",
    streetName: "",
    suburb: "",
    postcode: "",
    ...initialFormData, // Use initial form data if provided
  });

  const streetTypes = [
    "Street",
    "Road",
    "Avenue",
    "Boulevard",
    "Court",
    "Crescent",
    "Drive",
    "Lane",
    "Parade",
    "Place",
    "Terrace",
    "Way",
    "Close",
    "Esplanade",
    "Square",
    "Highway",
    "Circuit",
    "Gardens",
    "Grove",
  ];

  function validateForm() {
    let valid = true;
    const newErrors = {};

    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.firstName)) {
      newErrors.firstName = "First Name can only have letters.";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last Name can only have letters.";
      valid = false;
    }

    if (!/^04\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must start with '04' and be 10 digits long";
      valid = false;
    }

    if (formData.unitNumber && !/^\d+$/.test(formData.unitNumber)) {
      newErrors.unitNumber = "Invalid unit number";
      valid = false;
    }

    if (!formData.streetNumber) {
      newErrors.streetNumber = "Street number is required";
      valid = false;
    } else if (!/^\d+$/.test(formData.streetNumber)) {
      newErrors.streetNumber = "Street number must be a valid number";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.streetName)) {
      newErrors.streetName = "Street Name must be letters.";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.suburb)) {
      newErrors.suburb = "Suburb names can only be letters or space!";
      valid = false;
    }

    if (!/^\d{4}$/.test(formData.postcode)) {
      newErrors.postcode = "Postcode must be exactly 4 digits";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatusMessage("");

    if (!validateForm()) {
      setStatusMessage("Please correct the errors above");
      return;
    }

    setStatusMessage("Processing...");
    onSubmit(formData)
      .then((result) => {
        setStatusMessage(result.message);
      })
      .catch((error) => {
        setStatusMessage("Submission failed: " + error);
      });
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-10 rounded-lg shadow-2xl max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              title="Please enter a valid email address"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName}</p>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName}</p>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              type="text"
              placeholder="Enter your phone number"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Unit Number</span>
            </label>
            <input
              type="text"
              placeholder="Enter your unit number"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.unitNumber}
              onChange={(e) =>
                setFormData({ ...formData, unitNumber: e.target.value })
              }
            />
            {errors.unitNumber && (
              <p className="text-red-500 text-xs">{errors.unitNumber}</p>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Street Number</span>
            </label>
            <input
              type="text"
              placeholder="Enter your street number"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.streetNumber}
              onChange={(e) =>
                setFormData({ ...formData, streetNumber: e.target.value })
              }
            />
            {errors.streetNumber && (
              <p className="text-red-500 text-xs">{errors.streetNumber}</p>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Street Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your street name"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.streetName}
              onChange={(e) =>
                setFormData({ ...formData, streetName: e.target.value })
              }
            />
            {errors.streetName && (
              <p className="text-red-500 text-xs">{errors.streetName}</p>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Street Type</span>
            </label>
            <select
              value={formData.streetType}
              onChange={(e) =>
                setFormData({ ...formData, streetType: e.target.value })
              }
              className="select select-bordered w-full"
            >
              {streetTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Suburb</span>
            </label>
            <input
              type="text"
              placeholder="Enter your suburb"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.suburb}
              onChange={(e) =>
                setFormData({ ...formData, suburb: e.target.value })
              }
            />
            {errors.suburb && (
              <p className="text-red-500 text-xs">{errors.suburb}</p>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Postcode</span>
            </label>
            <input
              type="text"
              placeholder="Enter your postcode"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.postcode}
              onChange={(e) =>
                setFormData({ ...formData, postcode: e.target.value })
              }
            />
            {errors.postcode && (
              <p className="text-red-500 text-xs">{errors.postcode}</p>
            )}
          </div>

          <div className="mt-6">
            <button type="submit" className="btn btn-primary w-full">
              {buttonText}
            </button>
          </div>

          {statusMessage && (
            <p className="mt-4 text-center text-red-500">{statusMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
