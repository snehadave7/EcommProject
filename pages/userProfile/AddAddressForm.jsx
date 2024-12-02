import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import "./AddAddressForm.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  EditAddress,
  fetchAllAddress,
} from "../../store/addressSlice";
import AddressCard from "./AddressCard";
import { toast } from "react-toastify";

const initialState = {
  addresses: [
    {
      address: "",
      city: "",
      pincode: "",
      phone: "",
      notes: "",
    },
  ],
};

const AddAddressForm = ({setCurrentSelectedAddress}) => {
  const dispatch = useDispatch();
  const userId = localStorage.userId;
  const { addressList } = useSelector((state) => state.shopAddress);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null); // State to track the selected address

  // const {toast}=useToast();
  useEffect(() => {
    dispatch(fetchAllAddress(userId));
  }, [dispatch]);
  // dispatch(fetchAllAddress(userId));
  const [formData, setFormData] = useState(initialState);

  // console.log(addressList);

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    // const updatedAddresses = [...formData.addresses];
    // updatedAddresses[index][field] = value;
    // setFormData({ ...formData, addresses: updatedAddresses });
    setFormData({ ...formData, [field]: value });
    const newErrors = validate();
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.pincode) newErrors.pincode = "Pincode is required.";
    if (!formData.phone) newErrors.phone = "Phone is required.";

    return newErrors;
  };

  function handleManageAddress(event) {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      if (addressList.length >= 3 && currentEditedId === null) {
        setFormData(initialState);
        toast.error("You can add max 3 address");

        return;
      }
      currentEditedId != null
        ? dispatch(EditAddress({ addressId: currentEditedId, formData })).then(
            (data) => {
              if (data.payload) {
                dispatch(fetchAllAddress(userId));
                setCurrentEditedId(null);
                setFormData(initialState);
                toast.success("Address updated successfully");
              }
            }
          )
        : dispatch(
            addNewAddress({
              addresses: {
                id: 0,
                userId: parseInt(userId),
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                phone: formData.phone,
                notes: formData.notes,
              },
              userId: userId,
            })
          ).then((data) => {
            dispatch(fetchAllAddress(userId));
            setFormData(initialState);
            toast.success("Address added successfully");
          });
    }
  }

  function handleEditAddress(addressData) {
    console.log(addressData, "address data");
    setCurrentEditedId(addressData.id);
    setFormData({
      ...formData,
      id: addressData.id,
      userId: parseInt(userId),
      address: addressData?.address,
      city: addressData?.city,
      pincode: addressData?.pincode,
      phone: addressData?.phone,
      notes: addressData?.notes,
    });
  }
  const handleDelete = (id) => {
    dispatch(deleteAddress(id)).then((data) => {
      if (data) {
        dispatch(fetchAllAddress(userId));

        toast.success("Address deleted successfully");
      }
    });
  };
  return (
    <div
      className="add-address-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          width: "100%",
        }}
      >
        {addressList && addressList.length > 0
          ? addressList.map((singleAddItem) => (
              <AddressCard
                key={singleAddItem.id}
                addressData={singleAddItem}
                handleEditAddress={handleEditAddress}
                onDelete={handleDelete}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
                isSelected={selectedAddress?.id===singleAddItem.id}
              />
            ))
          : null}
      </div>
      <h2>{currentEditedId != null ? "Edit Address" : "Add New Address"}</h2>

      <form onSubmit={handleManageAddress}>
        <div className="address-block">
          <h3>Address</h3>

          {/* Address Field */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address || ""}
            onChange={(e) => handleInputChange(e, "address")}
          />
          {/* Error Message */}
          {errors.address && <span className="error">{errors.address}</span>}

          {/* City Field */}
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city || ""}
            onChange={(e) => handleInputChange(e, "city")}
          />
          {/* Error Message */}
          {errors.city && <span className="error">{errors.city}</span>}

          {/* Pincode Field */}
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode || ""}
            onChange={(e) => handleInputChange(e, "pincode")}
          />
          {/* Error Message */}
          {errors.pincode && <span className="error">{errors.pincode}</span>}

          {/* Phone Field */}
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone || ""}
            onChange={(e) => handleInputChange(e, "phone")}
          />
          {/* Error Message */}
          {errors.phone && <span className="error">{errors.phone}</span>}

          {/* Notes Field */}
          <textarea
            name="notes"
            placeholder="Notes (Optional)"
            value={formData.notes || ""}
            onChange={(e) => handleInputChange(e, "notes")}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          {currentEditedId != null ? "Edit" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddAddressForm;
