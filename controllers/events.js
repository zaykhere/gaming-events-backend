const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


exports.getAllEvents = async(req,res) => {
    const events = await prisma.event.findMany({
        include: {
            createdBy: true
        }
    });

    if(!events) return res.status(404).json({error: "No events found"});
    
    res.status(200).json({events: events});
}