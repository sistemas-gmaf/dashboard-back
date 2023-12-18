export const get = async (req, res) => {
  try {
    const { profile } = req.user;
  
    res.json(profile);
  } catch (error) {
    res.status(500).send(error);
  }
 
};