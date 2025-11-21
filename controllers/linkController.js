import Link from "../models/Link.js";
import { isValidUrl } from "../utils/validateUrl.js";

export const createLink = async (req, res) => {
  const { targetUrl, code } = req.body;

  if (!isValidUrl(targetUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
    return res
      .status(400)
      .json({ error: "Code must be 6-8 alphanumeric characters" });
  }

  const existing = await Link.findOne({ code });
  if (existing) {
    return res.status(409).json({ error: "Code already exists" });
  }

  const link = await Link.create({ targetUrl, code });
  return res.status(201).json(link);
};

export const listLinks = async (req, res) => {
  const links = await Link.find().sort({ createdAt: -1 });
  return res.json(links);
};

export const getLinkStats = async (req, res) => {
  const code = req.params.code;
  const link = await Link.findOne({ code });

  if (!link) return res.status(404).json({ error: "Not found" });

  return res.json(link);
};

export const updateLink = async (req, res) =>{
  const code = req.params.code
  const{ newTargetUrl, newCode} = req.body
  const link = await Link.findOne({ code });
  console.log(newTargetUrl)
  console.log( newCode)
  if (!link) return res.status(404).json({ error: "Not found" });
  if(newTargetUrl) link.targetUrl = newTargetUrl;
  if(newCode) link.code = newCode
  link.updatedAt = Date.now()
  await link.save()
  
}

export const deleteLink = async (req, res) => {
  const code = req.params.code;
  const deleted = await Link.findOneAndDelete({ code });

  if (!deleted) return res.status(404).json({ error: "Not found" });

  return res.json({ success: true });
};
