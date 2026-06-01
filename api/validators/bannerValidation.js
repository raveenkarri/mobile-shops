import Joi from "joi";

const conditionSchema = Joi.object({
  minPurchaseAmount: Joi.number().min(0).optional(),
  applicableProducts: Joi.alternatives().try(
    Joi.array().items(Joi.string().hex().length(24)),
    Joi.string().allow(""),
  ),
  category: Joi.string().valid("mobiles", "earphones", "accessories", "").optional(),
});

export const createBannerSchema = Joi.object({
  title: Joi.string().min(2).max(120).required(),
  description: Joi.string().max(250).allow("").optional(),
  type: Joi.string().valid("discount", "bogo", "combo_offer").required(),
  discountType: Joi.string().valid("percentage", "fixed", "").optional(),
  discountValue: Joi.number().min(0).optional(),
  freeProduct: Joi.string().max(120).allow("").optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  link: Joi.string().allow("").uri().optional(),
  shopId: Joi.string().hex().length(24).allow("", null).optional(),
  isActive: Joi.boolean().optional(),
  conditions: conditionSchema.optional(),
});

export const updateBannerSchema = Joi.object({
  title: Joi.string().min(2).max(120).optional(),
  description: Joi.string().max(250).allow("").optional(),
  type: Joi.string().valid("discount", "bogo", "combo_offer").optional(),
  discountType: Joi.string().valid("percentage", "fixed", "").optional(),
  discountValue: Joi.number().min(0).optional(),
  freeProduct: Joi.string().max(120).allow("").optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  link: Joi.string().allow("").uri().optional(),
  isActive: Joi.boolean().optional(),
  conditions: conditionSchema.optional(),
}).min(1);
