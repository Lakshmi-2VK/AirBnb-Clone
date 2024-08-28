import { useContext, useEffect, useState } from "react";
import {differenceInCalendarDays} from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import {UserContext} from "./UserContext.jsx";

export default function BookingWidget({place}){
    const[checkIn,setCheckIn]= useState('');
    const[checkOut,setCheckOut]= useState('');
    const[numberOfGuests,setNumberOfGuests]= useState(1);
    const[name,setName]= useState('');
    const[phone,setPhone]= useState('');
    const [redirect, setRedirect]= useState('');
    const {user}= useContext(UserContext); 

    useEffect(() => {
        if(user) {
            setName(user.name);
        }
    },[user])

    let numberOfDays=0;

    if(checkIn && checkOut){
            numberOfDays= differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
        }

    async function bookThisPlace(){
        const response= await axios.post('/bookings',{checkIn, checkOut,
            numberOfGuests,name,phone,
            place: place._id,
            price: numberOfDays*place.price,});
        const bookingId= response.data._id;
        setRedirect(`/account/bookings/${bookingId}`)
    }

    if(redirect){
        return <Navigate to={redirect} />
    }

    return(
    <div className=" p-4 rounded-2xl shadow shadow-black ">
        <div className="text-2xl text-center font-semibold">Price: ${place.price} /per night</div>
        <div className="border rounded-2xl mt-4">  
            <div className="flex">
                <div className="py-3 py-4" >
                    <label>Check In: </label>
                    <input type="date" value={checkIn} onChange={ev =>setCheckIn(ev.target.value)}/>
                </div>
                <div className="py-3 py-4 border-l">
                    <label >Check Out: </label>
                    <input type="date" value={checkOut} onChange={ev =>setCheckOut(ev.target.value)}/>
                </div>
            </div>
                <div className="py-3 py-4 border-t">
                    <label >Number of Guests: </label>
                    <input type="number"  value={numberOfGuests} onChange={ev =>setNumberOfGuests(ev.target.value)}/>
                </div>
                {numberOfDays>0 && (
                    <div className="py-3 px-4 border-t">
                        <label>Full Name:</label>
                        <input type="text"  value={name} onChange={ev =>setName(ev.target.value)}/>
                        <label>Phone Number:</label>
                        <input type="tel"  value={phone} onChange={ev =>setPhone(ev.target.value)}/>
                    </div>
                )}
        </div>  
        
        <button onClick={bookThisPlace} className="primary p-4">
            Book this Place 
            {numberOfDays>0 && (
                <span> ${numberOfDays * place.price}</span>
            )}
            
        </button>
    </div>
    );

}