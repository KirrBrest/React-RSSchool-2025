import './About.css';
import logo from './assets/logo/logo.jpg';
import kirill from './assets/photos/kirill.png';

function About() {
  const teamMembers = [
    {
      id: 1,
      name: 'Kiryl',
      role: 'Frontend Developer',
      bio: 'A young man of forty years old, head of the family, loving father and husband, experienced manager, salesperson, passionate frontend developer. Maximally effective in everything. I work in the field of construction management and am studying at the best IT school - RSSchool.',
      github: 'https://github.com/KirrBrest',
      photo: kirill,
    },
  ];

  return (
    <div className="about-container">
      <div className="about-header">
        <a
          href="https://rs.school/courses/javascript"
          target="_blank"
          rel="noreferrer"
        >
          <img src={logo} alt="RS School Logo" className="rs-logo" />
        </a>
        <h1>About me</h1>
      </div>

      <div className="team-members">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-member-card">
            <img
              src={member.photo}
              alt={member.name}
              className="member-photo"
            />
            <h2>{member.name}</h2>
            <h3>{member.role}</h3>
            <p className="member-bio">{member.bio}</p>
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              GitHub Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
