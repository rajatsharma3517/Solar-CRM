import {
  Users,
  Clock3,
  PhoneCall,
  CheckCircle,
  XCircle,
} from "lucide-react";

function DashboardCards({ customers }) {
  const total = customers.length;

  const pending = customers.filter(
    (customer) => customer.status === "Pending"
  ).length;

  const contacted = customers.filter(
    (customer) => customer.status === "Contacted"
  ).length;

  const completed = customers.filter(
    (customer) => customer.status === "Completed"
  ).length;

  const rejected = customers.filter(
    (customer) => customer.status === "Rejected"
  ).length;

  const cards = [
    {
      title: "Total Customers",
      value: total,
      icon: <Users size={28} />,
      bg: "bg-blue-500",
    },
    {
      title: "Pending",
      value: pending,
      icon: <Clock3 size={28} />,
      bg: "bg-yellow-500",
    },
    {
      title: "Contacted",
      value: contacted,
      icon: <PhoneCall size={28} />,
      bg: "bg-purple-500",
    },
    {
      title: "Completed",
      value: completed,
      icon: <CheckCircle size={28} />,
      bg: "bg-green-500",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: <XCircle size={28} />,
      bg: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 my-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex justify-between items-center"
        >
          <div>
            <p className="text-gray-500 text-sm">{card.title}</p>

            <h2 className="text-3xl font-bold mt-2">
              {card.value}
            </h2>
          </div>

          <div
            className={`${card.bg} text-white p-4 rounded-xl`}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;