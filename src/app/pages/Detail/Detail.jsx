import React from "react";
import DetailPng from "../../components/DetailPng";
import { sProductData } from "./Detail.store";

export default function Detail() {
  const proData = sProductData.use();
  return <DetailPng />;
}
