const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllEvents = async (req, res) => {
  if (!req.query.term) {
    const events = await prisma.event.findMany({
      include: {
        createdBy: true,
      },
    });

    if (!events) return res.status(404).json({ error: "No events found" });

    res.status(200).json({ events: events });
  } else {
    const { term } = req.query;

    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            name: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            venue: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (!events) return res.status(404).json({ error: "No events found" });
    res.status(200).json({ events: events });
  }
};

exports.getLatestEvents = async (req, res) => {
  const events = await prisma.event.findMany({
    take: 3,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  if (!events) return res.status(404).json({ error: "No events found" });
  res.status(200).json({ events: events });
};

exports.searchEventBySlug = async (req, res) => {
  const evt = await prisma.event.findFirst({
    where: {
      AND: [
        {
          slug: {
            equals: req.params.slug,
          },
        },
        {
          id: {
            equals: parseInt(req.params.id),
          },
        },
      ],
    },
  });
  if (!evt) return res.status(404).json({ error: "No events found" });
  evt.date = new Date(evt.date).toDateString();
  res.status(200).json({ evt: evt });
};
