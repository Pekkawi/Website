"use client";

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
    name: z.string().min(2,"Name must be at least 2 charachters").max(30,"Name must be less than 30 charachters"),
    abbreviation: z.string().length(3,"Abbreviation must be exactly 3 charachters"),
    description: z.string().max(200,"Description must be less than 200 charachters").optional(),
    scheduling: z.enum(["on_demand","locking"]),
    image: z.any().refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'Max image size is 5MB').refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Only .jpg , .jpeg , .png and .webp formats are supported"
    ),
    Permission: z.enum(["Default","Special Requirments"])
    });



const PermissionsForm = () =>{
    

    return (
        <div>
            <p> Nothing yet</p>
        </div>
    )
}

export default PermissionsForm