
namespace domain.Conference.Command
{
    public class ChangeStateCommand: AbstractConferenceCommand
    {
        public ConfState State { get; set; }
    }
}
