/**
 * Created by eshavish on 9/23/2016.
 */
//<script type="text/javascript">
    function OnDropDownChange(dropDown) {
        var selectedValue = dropDown.options[dropDown.selectedIndex].value;
        document.getElementById("txtSelectedCity").value = selectedValue;
    }
    </script>

    <form action = "">
    <select name = "Cities" onChange="OnDropDownChange(this);">
    <option value="----">--Select--</option>
    <option value="roma">Roma</option>
    <option value="torino">Torino</option>
    <option value="milan">Milan</option>
    </select>
    <br/>
    <br/>
    <input type="button" value="Test">
    <input type="text" id="txtSelectedCity" name="SelectedCity" value="" />
    </form>
