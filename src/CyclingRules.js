
import React from 'react';
import './CyclingRules.css'; 

const rules = [
  "Cyclists must ride on the left side of the road and follow all road rules, including traffic signals and signs.",
  "If there's a bicycle lane, cyclists should use it where possible.",
  "Cyclists must wear an approved helmet at all times while riding.",
  "Bikes must be equipped with front and rear lights if riding at night or in low-light conditions.",
  "Reflectors or other visibility aids are required.",
  "Cyclists should use hand signals to indicate turns or stops.",
  "Only one person may ride on a bike at a time, unless the bike is specifically designed for more.",
  "When riding in groups, cyclists should ride no more than two abreast and should not impede traffic.",
  "Cyclists should position themselves where they are visible to drivers, particularly at intersections.",
  "Cycling under the influence of alcohol or drugs is prohibited and subject to penalties.",
  "Cyclists must give way to pedestrians on shared paths and be courteous."
];

const CyclingRules = () => {
  return (
    <div className="cycling-rules">
      <h1>Bicycle Riding Rules</h1>
      <ul>
        {rules.map((rule, index) => (
          <li key={index}> {index+1}. {rule}</li>
        ))}
      </ul>

      <div>
  Sources: <a href="https://www.vicroads.vic.gov.au/safety-and-road-rules/road-rules/a-to-z-of-road-rules/bicycles" target="_blank" rel="noopener noreferrer">VicRoads Bicycle Rules</a>
</div>
 </div>
  );
};

export default CyclingRules;
