"use client";

import { useRouter } from "next/navigation";
import { Book } from "@/models/book";
import moment from "moment";
import Checkout, { isCheckoutValid } from "@/models/checkout";
import React, { useState } from "react";
import Modal, {
  ModalForm,
  ModalFormButton,
  ModalTextInput,
} from "@/components/Modal";

const postCheckout = async (checkout: Checkout) => {
  const url = process.env.NEXT_PUBLIC_API_ROOT + "checkout/checkout";
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(checkout),
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
  });

  if (!res.ok) throw new Error("Something went wrong.");
};

const dateNow = moment().format("yyyy-MM-DD");
const dateDue = moment().add(1, "month").format("yyyy-MM-DD");

export default function CheckoutChanger({ book }: { book: Book }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [checkout, setCheckout] = useState<Checkout>({
    borrowerFirstName: "",
    borrowerLastName: "",
    borrowedBook: book,
    checkedOutDate: dateNow,
    dueDate: dateDue,
    returnedDate: null,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isCheckoutValid(checkout)) await postCheckout(checkout);
      router.refresh();
      switchModal();
    } catch (e) {
      console.error((e as Error).message);
    }
  };

  const switchModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleChange = (inputName: string) => {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      setCheckout((prevState) => {
        if (inputName == "firstName") {
          return {
            ...prevState,
            borrowerFirstName: e.target.value,
          };
        }
        if (inputName == "lastName") {
          return {
            ...prevState,
            borrowerLastName: e.target.value,
          };
        }
        return { ...prevState };
      });
    };
  };

  return book.status == "AVAILABLE" ? (
    modalOpen ? (
      <Modal setModalOpen={setModalOpen}>
        <ModalForm onSubmit={handleSubmit}>
          <ModalTextInput
            name="firstName"
            placeholder="First name"
            onChange={handleChange("firstName")}
            required={true}
          />
          <ModalTextInput
            name="lastName"
            placeholder="Last name"
            onChange={handleChange("lastName")}
            required={true}
          />
          <ModalFormButton value="Checkout book" />
        </ModalForm>
      </Modal>
    ) : (
      <p onClick={switchModal}>Checkout book</p>
    )
  ) : (
    <p>Book not available</p>
  );
}
