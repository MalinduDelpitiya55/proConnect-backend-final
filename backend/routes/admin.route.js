import express from "express";
import {
    getUsersCountByType, getTotalCompletedOrderPrices, getTotalGigCount
    
} from "./../controllers/admin.controllers.js";

import { getGigDetails, admindeleteGig } from './../controllers/table.controllers/gigstable.controller.js'
import { getPaymentDetails, admindeletepaymentDetails } from './../controllers/table.controllers/paymenttable.controller.js'
import { buyersDetails, admindeletebuyersDetails } from './../controllers/table.controllers/buyersDetails.controller.js'
import { sellersDetails, admindeletesellersDetails } from './../controllers/table.controllers/sellerDetails.controller.js'
import { getratingDetails, adminratingGig, adminratingedit } from './../controllers/table.controllers/rating.controler.js'

const router = express.Router();
router.post("/userCount", getUsersCountByType);
router.post("/getTotalCompletedOrderPrices", getTotalCompletedOrderPrices);
router.post("/getTotalGigCount", getTotalGigCount);

router.post("/gigsDetails", getGigDetails);
router.post("/deleteGig/:id", admindeleteGig);

router.post("/getpayment", getPaymentDetails);
router.post("/deletepayment/:id", admindeletepaymentDetails);

router.post("/buyersDetails", buyersDetails);
router.post("/buyersDelete/:id", admindeletebuyersDetails);

router.post("/sellerDetails", sellersDetails);
router.post("/sellerDelete/:id", admindeletesellersDetails);

router.post("/ratingDetails", getratingDetails);
router.post("/ratingDelete/:id", adminratingGig);
router.post("/ratingUpdate/:id", adminratingedit);



export default router;