import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import trainersRouter from "./trainers.js";
import blogRouter from "./blog.js";
import testimonialsRouter from "./testimonials.js";
import pricingRouter from "./pricing.js";
import galleryRouter from "./gallery.js";
import performanceRouter from "./performance.js";
import paymentsRouter from "./payments.js";
import contactRouter from "./contact.js";
import adminRouter from "./admin.js";
import trainerPortalRouter from "./trainer-portal.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/trainers", trainersRouter);
router.use("/blog", blogRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/pricing", pricingRouter);
router.use("/gallery", galleryRouter);
router.use("/performance", performanceRouter);
router.use("/payments", paymentsRouter);
router.use("/contact", contactRouter);
router.use("/admin", adminRouter);
router.use("/trainer", trainerPortalRouter);

export default router;
