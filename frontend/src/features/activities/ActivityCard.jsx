const ActivityCard = ({ name, description }) => {
    return (

      <div className="grid grid-cols-1 gap-6 card shadow-lg rounded-lg p-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p>{description}</p>
      </div>
  
    );
  };

  export default ActivityCard