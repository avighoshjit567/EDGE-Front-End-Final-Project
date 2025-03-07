import { useState } from "react";

export default function Sqaure({value, onSquareClick}) {

    return <button className="square" onClick={onSquareClick}>{value}</button>;
}