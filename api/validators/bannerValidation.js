import Joi from "joi";

export const createBannerSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  link: Joi.string().allow("").uri().optional(),
  shopId: Joi.string().hex().length(24).allow("", null).optional(),
  isActive: Joi.boolean().optional(),
});

export const updateBannerSchema = Joi.object({
  title: Joi.string().min(2).max(100).optional(),
  link: Joi.string().allow("").uri().optional(),
  isActive: Joi.boolean().optional(),
}).min(1);
