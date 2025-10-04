import axios from "axios";

export const getPMCXml = async (req, res) => {
  const { pmcId } = req.query;
  if (!pmcId) return res.status(400).json({ error: "Missing pmcId" });

  try {
    const xmlUrl = `https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_xml/${pmcId}/unicode`;
    const { data } = await axios.get(xmlUrl);
    res.set("Content-Type", "application/xml");
    res.send(data);
  } catch (error) {
    console.error("NCBI fetch error:", error);
    res.status(500).json({ error: "Error fetching XML" });
  }
};
