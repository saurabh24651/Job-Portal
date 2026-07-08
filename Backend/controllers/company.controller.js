// import { mergeAlias } from 'vite';
import Company from '../models/company.model.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';


//to get all companies
export const getCompanies=async (req, res)=>{
    try {
        const companies=await Company.find();
        res.status(200).json({
            success: true,
            companies
        });
    }
     catch (err) {
        res.status(500).json({
            success:false,
            message: err.message
        })     
    }
}

//to add a company (admin)
export const addCompany=async(req,res)=>{
    try {
        const {website}=req.body;
        if(!website){
            return res.status(400).json({
                success:false,
                message:"Website is requied"
            })
        }
        let logoUrl="";
        if(req.file){
            const uploadResult=await uploadToCloudinary(
                req.file.buffer,
                "jobportal/logos",
                'image',
                req.file.originalname
            );
            logoUrl=uploadResult.secure_url;
        }
        const company= await Company.create({
            logo:logoUrl,
            website,
          createdBy: req.user.id
        });
        res.status(201).json({
            success:true,
            message:"Company added succesfully!",
            company
        });
    } 
    catch (err) {
        res.status(500).json({
            success:false,
            message: err.message
        })     
    }
}

//delete the company
export const deleteCompany=async(req,res)=>{
    try {
        const company = await Company.findById(req.params.id);
        if(!company)
        {
            return res.status(404).json({
                success:false,
                message:"Company not found"
            });
        }
        await company.deleteOne();
     res.status(200).json({
        success:true,
        message: "Company deleted sucessfully!!" 
     })
    } 
    catch (err) {
        res.status(500).json({
            success:false,
            message: err.message
        })     
    }
}