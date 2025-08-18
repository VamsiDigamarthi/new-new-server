import ArticleModel from "../Modals/ArticleModel.js";
import SubscribeModal from "../Modals/SubscribeEmailModal.js";

export const getLast7DaysArticleCount = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();

    // Set date to 6 days ago (because today counts as day 7)
    sevenDaysAgo.setDate(today.getDate() - 6);

    // Helper: set time to start/end of day
    function startOfDay(date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    function endOfDay(date) {
      const d = new Date(date);
      d.setHours(23, 59, 59, 999);
      return d;
    }

    // Aggregate data
    const results = await ArticleModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay(sevenDaysAgo),
            $lte: endOfDay(today),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Create map for quick lookup
    const resultMap = {};
    results.forEach((item) => {
      resultMap[item._id] = item.count;
    });

    // Generate full date range
    const dateRange = [];
    let currentDate = new Date(sevenDaysAgo);

    while (currentDate <= today) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(currentDate.getDate()).padStart(2, "0");
      dateRange.push(`${year}-${month}-${day}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Map counts or 0
    const chartData = dateRange.map((date) => resultMap[date] || 0);

    res.status(200).json(chartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics",
    });
  }
};

export const subScribeToemail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "Email is required" });

    const already = await SubscribeModal.findOne({ email });

    if (already) return res.status(400).send({ message: "Already Subscribed" });

    const newOne = await SubscribeModal.create({ email });

    return res.status(200).send({ message: "Subscribed Successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getAllsubs = async (req, res) => {
  try {
    const already = await SubscribeModal.find({});
    return res.status(200).send(already);
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
